import { generateCoachReply } from '@/lib/coach-ai'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'
const MessageSchema = z.object({ message: z.string().trim().min(1).max(2_000) })

export async function GET() {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: USER_ID },
      orderBy: { createdAt: 'asc' },
      take: 100,
    })

    return NextResponse.json(
      messages.map((msg) => ({
        id: msg.id,
        from: msg.from,
        text: msg.text,
        timestamp: msg.createdAt.toISOString(),
      })),
    )
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = MessageSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: 'Message is required and must be under 2,000 characters.' }, { status: 400 })

  let userName = 'Athlete'
  let userGoal = 'Performance & Body Recomposition'
  let currentWeight = 78.4
  let targetWeight = 75
  let calorieGoal = 2000
  let sleepHours = 7.5
  let hydration = 2500
  let workoutMinutes = 45

  try {
    const user = await prisma.user.findUnique({ where: { id: USER_ID } })
    if (user) {
      userName = user.name
      userGoal = user.goal
      currentWeight = user.currentWeight ?? currentWeight
      targetWeight = user.targetWeight ?? targetWeight
      calorieGoal = user.calorieGoal
    }

    const latestStats = await prisma.dailyStats.findFirst({
      where: { userId: USER_ID },
      orderBy: { date: 'desc' },
    })
    if (latestStats) {
      sleepHours = latestStats.sleepHours ?? sleepHours
      hydration = latestStats.hydration ?? hydration
      workoutMinutes = latestStats.workoutMinutes ?? workoutMinutes
    }

    await prisma.chatMessage.create({
      data: { userId: USER_ID, from: 'user', text: parsed.data.message },
    })
  } catch {
    // Database offline or not configured - proceed gracefully
  }

  const aiText = await generateCoachReply(parsed.data.message, {
    athleteName: userName,
    goal: userGoal,
    currentWeight,
    targetWeight,
    calorieGoal,
    sleepHours,
    hydration,
    workoutMinutes,
  })

  let msgId = `ai-${Date.now()}`
  let timestamp = new Date().toISOString()

  try {
    const aiMessage = await prisma.chatMessage.create({
      data: { userId: USER_ID, from: 'ai', text: aiText },
    })
    msgId = aiMessage.id
    timestamp = aiMessage.createdAt.toISOString()
  } catch {
    // Fallback ID when Prisma is offline
  }

  return NextResponse.json({
    id: msgId,
    from: 'ai',
    text: aiText,
    timestamp,
  })
}
