import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const days = Math.min(parseInt(searchParams.get('days') ?? '7', 10), 90)

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
