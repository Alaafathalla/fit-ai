import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

export async function GET() {
  const today = new Date(); today.setHours(0, 0, 0, 0)

  // Get today's stats for calorie count
  const todayStats = await prisma.dailyStats.findUnique({
    where: { userId_date: { userId: USER_ID, date: today } },
  })

  // Get user's calorie goal
  const user = await prisma.user.findUnique({
    where: { id: USER_ID },
    select: { calorieGoal: true },
  })

  // Sum macros from today's meal logs
  const logs = await prisma.mealLog.findMany({
    where: { userId: USER_ID, date: today },
    include: { meal: { select: { protein: true, carbs: true, fat: true } } },
  })

  const protein = logs.reduce((s, l) => s + l.meal.protein, 0)
  const carbs   = logs.reduce((s, l) => s + l.meal.carbs,   0)
  const fat     = logs.reduce((s, l) => s + l.meal.fat,     0)

  return NextResponse.json({
    calories:    todayStats?.calories    ?? 0,
    calorieGoal: user?.calorieGoal       ?? 2000,
    protein:     Math.round(protein),
    carbs:       Math.round(carbs),
    fat:         Math.round(fat),
  })
}
