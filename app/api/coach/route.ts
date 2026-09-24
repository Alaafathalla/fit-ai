import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'
const MessageSchema = z.object({ message: z.string().trim().min(1).max(2_000) })

export async function GET() {
  const messages = await prisma.chatMessage.findMany({
    where: { userId: USER_ID },
    orderBy: { createdAt: 'asc' },
    take: 100,
  })

  return NextResponse.json(messages.map((message) => ({
    id: message.id,
    from: message.from,
    text: message.text,
    timestamp: message.createdAt.toISOString(),
  })))
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = MessageSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Message is required and must be under 2,000 characters.' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: USER_ID } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const latestStats = await prisma.dailyStats.findFirst({
    where: { userId: USER_ID },
    orderBy: { date: 'desc' },
  })

  await prisma.chatMessage.create({
    data: { userId: USER_ID, from: 'user', text: parsed.data.message },
  })

  const aiText = buildCoachReply(parsed.data.message, {
    goal: user.goal,
    calorieGoal: user.calorieGoal,
    sleepHours: latestStats?.sleepHours ?? 0,
    hydration: latestStats?.hydration ?? 0,
    workoutMinutes: latestStats?.workoutMinutes ?? 0,
  })

  const aiMessage = await prisma.chatMessage.create({
    data: { userId: USER_ID, from: 'ai', text: aiText },
  })

  return NextResponse.json({
    id: aiMessage.id,
    from: 'ai',
    text: aiMessage.text,
    timestamp: aiMessage.createdAt.toISOString(),
  })
}

function buildCoachReply(message: string, context: {
  goal: string
  calorieGoal: number
  sleepHours: number
  hydration: number
  workoutMinutes: number
}) {
  const text = message.toLowerCase()

  if (text.includes('sleep') || text.includes('recover')) {
    const sleepNote = context.sleepHours
      ? `Your latest sleep entry is ${context.sleepHours} hours.`
      : 'You do not have a recent sleep entry yet.'
    return `${sleepNote} Aim for a consistent 7.5–9 hour window, keep tonight’s session lighter if fatigue is high, and use the Recovery page before adding intensity.`
  }

  if (text.includes('calorie') || text.includes('food') || text.includes('nutrition') || text.includes('meal')) {
    return `Your current calorie target is ${context.calorieGoal.toLocaleString()} kcal/day. Keep protein consistent, build meals around minimally processed foods, and adjust portions based on your weekly trend rather than a single day.`
  }

  if (text.includes('workout') || text.includes('plan') || text.includes('strength') || text.includes('cardio')) {
    const recoveryHint = context.sleepHours >= 7 && context.hydration >= 2_000
      ? 'Your latest recovery markers support a normal training day.'
      : 'Your recovery markers suggest keeping today’s intensity controlled.'
    return `${recoveryHint} For your goal${context.goal ? ` (${context.goal})` : ''}, use 3–5 structured training days, keep at least one recovery day between demanding sessions, and progress volume gradually.`
  }

  if (text.includes('water') || text.includes('hydrat')) {
    return `Your latest hydration entry is ${context.hydration.toLocaleString()} ml. A practical daily target is around 2.5 L, with more fluid around longer or hotter training sessions.`
  }

  return `For ${context.goal || 'your current fitness goal'}, focus on consistency first: progressive training, enough protein, regular sleep, and a weekly trend check. I can help you turn that into a workout plan, nutrition target, or recovery routine.`
}
