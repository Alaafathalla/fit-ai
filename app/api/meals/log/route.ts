import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

const Schema = z.object({ mealId: z.string() })

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const today = new Date(); today.setHours(0, 0, 0, 0)

  const log = await prisma.mealLog.create({
    data: { userId: USER_ID, mealId: parsed.data.mealId, date: today },
    include: { meal: true },
  })

  // Update today's calorie count
  await prisma.dailyStats.upsert({
    where: { userId_date: { userId: USER_ID, date: today } },
    update: { calories: { increment: log.meal.calories } },
    create: {
      userId: USER_ID,
      date: today,
      calorieGoal: 2000,
      calories: log.meal.calories,
    },
  })

  return NextResponse.json({ ok: true, logId: log.id })
}
