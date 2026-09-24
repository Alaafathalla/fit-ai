import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'
const Schema = z.object({ workoutId: z.string().min(1) })

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'A valid workoutId is required' }, { status: 400 })

  const workout = await prisma.workout.findUnique({ where: { id: parsed.data.workoutId } })
  if (!workout) return NextResponse.json({ error: 'Workout not found' }, { status: 404 })

  const user = await prisma.user.findUnique({ where: { id: USER_ID }, select: { calorieGoal: true } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const session = await prisma.$transaction(async (tx) => {
    const created = await tx.workoutSession.create({
      data: { userId: USER_ID, workoutId: workout.id, duration: workout.duration },
    })

    await tx.workout.update({
      where: { id: workout.id },
      data: { completedCount: { increment: 1 } },
    })

    await tx.dailyStats.upsert({
      where: { userId_date: { userId: USER_ID, date: today } },
      update: { workoutMinutes: { increment: workout.duration } },
      create: {
        userId: USER_ID,
        date: today,
        calorieGoal: user.calorieGoal,
        workoutMinutes: workout.duration,
      },
    })

    return created
  })

  await recalcStreak(USER_ID)
  return NextResponse.json({ ok: true, sessionId: session.id })
}

async function recalcStreak(userId: string) {
  const stats = await prisma.dailyStats.findMany({
    where: { userId, workoutMinutes: { gt: 0 } },
    orderBy: { date: 'desc' },
    select: { date: true },
  })

  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  for (const stat of stats) {
    const date = new Date(stat.date)
    date.setHours(0, 0, 0, 0)
    const diffDays = Math.round((cursor.getTime() - date.getTime()) / 86_400_000)

    if (diffDays > 1) break
    if (diffDays < 0) continue

    streak += 1
    cursor.setTime(date.getTime())
  }

  await prisma.user.update({ where: { id: userId }, data: { streak } })
}
