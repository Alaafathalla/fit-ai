import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

const AI_RESPONSES = [
  "Great question! Based on your recent training data, I'd recommend adding 10% more volume this week.",
  "Your recovery looks excellent. You're ready for a high-intensity session today.",
  "To hit your goal faster, try cycling your carbs — high on training days, moderate on rest days.",
  "I noticed your sleep average dipped below 7 hours this week. Prioritizing sleep will dramatically boost your gains.",
  "Your bench press has been plateauing for 2 weeks. Time for a deload — reduce weight by 20% for 5 days.",
  "Excellent consistency! You've completed 85% of your planned workouts this month.",
  "Based on your body metrics, I've adjusted your calorie target to 1,950 kcal for optimal fat loss.",
]

// GET — load history
export async function GET() {
  const messages = await prisma.chatMessage.findMany({
    where: { userId: USER_ID },
    orderBy: { createdAt: 'asc' },
    take: 100,
  })

  return NextResponse.json(
    messages.map((m) => ({
      id:        m.id,
      from:      m.from,
      text:      m.text,
      timestamp: m.createdAt.toISOString(),
    })),
  )
}

// POST — send message + get AI reply
const Schema = z.object({ message: z.string().min(1) })

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  // Persist user message
  await prisma.chatMessage.create({
    data: { userId: USER_ID, from: 'user', text: parsed.data.message },
  })

  // Generate AI reply (random for now — swap with LLM call here)
  const aiText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]

  const aiMsg = await prisma.chatMessage.create({
    data: { userId: USER_ID, from: 'ai', text: aiText },
  })

  return NextResponse.json({
    id:        aiMsg.id,
    from:      'ai',
    text:      aiMsg.text,
    timestamp: aiMsg.createdAt.toISOString(),
  })
}
