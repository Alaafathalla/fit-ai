import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export async function GET() {
  const stats = (
    await prisma.dailyStats.findMany({
      where: { userId: USER_ID },
      orderBy: { date: 'desc' },
      take: 7,
    })
  ).reverse()

  const weekly = stats.map((s) => ({
    day: DAY_LABELS[new Date(s.date).getDay()],
    caloriesBurned: Math.round(s.workoutMinutes * 8.5),
    workoutMinutes: s.workoutMinutes,
    steps: s.steps,
  }))

  const first = stats[0]
  const last = stats[stats.length - 1]
  const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

  const metrics = first && last ? [
    {
      label: 'Body Weight',
      current: `${last.weight} kg`,
      previous: `${first.weight} kg`,
      change: `${last.weight < first.weight ? '↓' : last.weight > first.weight ? '↑' : '→'} ${Math.abs(last.weight - first.weight).toFixed(1)} kg`,
      positive: last.weight <= first.weight,
    },
    {
      label: 'Daily Steps',
      current: Math.round(average(stats.map((x) => x.steps))).toLocaleString(),
      previous: first.steps.toLocaleString(),
      change: `${last.steps >= first.steps ? '↑' : '↓'} ${Math.abs(Math.round(((last.steps - first.steps) / Math.max(first.steps, 1)) * 100))}%`,
      positive: last.steps >= first.steps,
    },
    {
      label: 'Workout Minutes',
      current: `${stats.reduce((sum, x) => sum + x.workoutMinutes, 0)} min`,
      previous: `${first.workoutMinutes} min`,
      change: `${Math.round(average(stats.map((x) => x.workoutMinutes)))} min/day avg`,
      positive: stats.some((x) => x.workoutMinutes > 0),
    },
    {
      label: 'Avg Sleep',
      current: `${average(stats.map((x) => x.sleepHours)).toFixed(1)} h`,
      previous: `${first.sleepHours} h`,
      change: last.sleepHours >= 7 ? 'Goal range' : 'Below 7 h',
      positive: last.sleepHours >= 7,
    },
    {
      label: 'Hydration',
      current: `${last.hydration} ml`,
      previous: `${first.hydration} ml`,
      change: last.hydration >= 2500 ? 'Goal met' : `${2500 - last.hydration} ml to go`,
      positive: last.hydration >= 2500,
    },
    {
      label: 'Calories',
      current: `${last.calories} kcal`,
      previous: `${first.calories} kcal`,
      change: `Goal: ${last.calorieGoal} kcal`,
      positive: Math.abs(last.calories - last.calorieGoal) <= Math.max(150, last.calorieGoal * 0.1),
    },
  ] : []

  return NextResponse.json({ weekly, metrics })
}
