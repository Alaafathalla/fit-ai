import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const requested = Number.parseInt(searchParams.get('days') ?? '7', 10)
  const days = Number.isFinite(requested) ? Math.max(1, Math.min(requested, 90)) : 7

  const stats = (
    await prisma.dailyStats.findMany({
      where: { userId: USER_ID },
      orderBy: { date: 'desc' },
      take: days,
    })
  ).reverse()

  return NextResponse.json(
    stats.map((s) => ({
      date: s.date.toISOString().split('T')[0],
      weight: s.weight,
      calories: s.calories,
      calorieGoal: s.calorieGoal,
      workoutMinutes: s.workoutMinutes,
      steps: s.steps,
      hydration: s.hydration,
      sleepHours: s.sleepHours,
    })),
  )
}
