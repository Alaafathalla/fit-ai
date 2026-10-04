import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [todayStats, user, logs] = await Promise.all([
    prisma.dailyStats.findUnique({
      where: { userId_date: { userId: USER_ID, date: today } },
    }),
    prisma.user.findUnique({
      where: { id: USER_ID },
      select: { calorieGoal: true },
    }),
    prisma.mealLog.findMany({
      where: { userId: USER_ID, date: today },
      include: { meal: { select: { protein: true, carbs: true, fat: true } } },
    }),
  ])

  const protein = logs.reduce((sum, log) => sum + log.meal.protein, 0)
  const carbs   = logs.reduce((sum, log) => sum + log.meal.carbs,   0)
  const fat     = logs.reduce((sum, log) => sum + log.meal.fat,     0)

  return NextResponse.json({
    calories:    todayStats?.calories ?? 0,
    calorieGoal: user?.calorieGoal    ?? 2000,
    protein:     Math.round(protein),
    carbs:       Math.round(carbs),
    fat:         Math.round(fat),
  })
}
