import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

const Schema = z.object({ workoutId: z.string() })

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  // Log session
  const session = await prisma.workoutSession.create({
    data: { userId: USER_ID, workoutId: parsed.data.workoutId },
  })

  // Bump completedCount
  await prisma.workout.update({
    where: { id: parsed.data.workoutId },
    data: { completedCount: { increment: 1 } },
  })

  // Update today's workoutMinutes
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const workout = await prisma.workout.findUnique({ where: { id: parsed.data.workoutId } })
  await prisma.dailyStats.upsert({
    where: { userId_date: { userId: USER_ID, date: today } },
    update: { workoutMinutes: { increment: workout?.duration ?? 0 } },
    create: {
      userId: USER_ID,
      date: today,
      calorieGoal: 2000,
      workoutMinutes: workout?.duration ?? 0,
    },
  })

  // Recalculate streak
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
  let cursor = new Date(); cursor.setHours(0, 0, 0, 0)
  for (const s of stats) {
    const d = new Date(s.date); d.setHours(0, 0, 0, 0)
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86400000)
    if (diff > 1) break
    streak++
    cursor = d
  }
  await prisma.user.update({ where: { id: userId }, data: { streak } })
}
