import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'
const Schema = z.object({ mealId: z.string().min(1) })

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'A valid mealId is required' }, { status: 400 })

  const [meal, user] = await Promise.all([
    prisma.meal.findUnique({ where: { id: parsed.data.mealId } }),
    prisma.user.findUnique({ where: { id: USER_ID }, select: { calorieGoal: true } }),
  ])

  if (!meal) return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const log = await prisma.$transaction(async (tx) => {
    const created = await tx.mealLog.create({
      data: { userId: USER_ID, mealId: meal.id, date: today },
    })

    await tx.dailyStats.upsert({
      where: { userId_date: { userId: USER_ID, date: today } },
      update: { calories: { increment: meal.calories } },
      create: {
        userId: USER_ID,
        date: today,
        calorieGoal: user.calorieGoal,
        calories: meal.calories,
      },
    })

    return created
  })

  return NextResponse.json({ ok: true, logId: log.id })
}
