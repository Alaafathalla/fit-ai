import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export async function GET() {
  // Last 7 days of stats
  const stats = await prisma.dailyStats.findMany({
    where: { userId: USER_ID },
    orderBy: { date: 'asc' },
    take: 7,
  })

  // Build WeeklyProgress shape from stats
  const weekly = stats.map((s) => ({
    day: DAY_LABELS[new Date(s.date).getDay()],
    caloriesBurned: Math.round(s.workoutMinutes * 8.5), // ~8.5 kcal/min avg
    workoutMinutes: s.workoutMinutes,
    steps: s.steps,
  }))

  // Build ProgressMetrics from first vs last stat entry
  const first = stats[0]
  const last  = stats[stats.length - 1]

  const metrics = first && last ? [
    {
      label:    'Body Weight',
      current:  `${last.weight} kg`,
      previous: `${first.weight} kg`,
      change:   `${last.weight < first.weight ? '↓' : '↑'} ${Math.abs(last.weight - first.weight).toFixed(1)} kg`,
      positive: last.weight <= first.weight,
    },
    {
      label:    'Daily Steps',
      current:  Math.round(stats.reduce((s, x) => s + x.steps, 0) / stats.length).toLocaleString(),
      previous: first.steps.toLocaleString(),
      change:   `${last.steps >= first.steps ? '↑' : '↓'} ${Math.abs(Math.round(((last.steps - first.steps) / (first.steps || 1)) * 100))} %`,
      positive: last.steps >= first.steps,
    },
    {
      label:    'Workout Minutes',
      current:  `${stats.reduce((s, x) => s + x.workoutMinutes, 0)} min`,
      previous: `${first.workoutMinutes} min`,
      change:   `${stats.reduce((s, x) => s + x.workoutMinutes, 0)} total`,
      positive: true,
    },
    {
      label:    'Avg Sleep',
      current:  `${(stats.reduce((s, x) => s + x.sleepHours, 0) / stats.length).toFixed(1)} h`,
      previous: `${first.sleepHours} h`,
      change:   last.sleepHours >= 7 ? '↑ Good' : '↓ Below goal',
      positive: last.sleepHours >= 7,
    },
    {
      label:    'Hydration',
      current:  `${last.hydration} ml`,
      previous: `${first.hydration} ml`,
      change:   `${last.hydration >= 2500 ? '✓ Goal met' : `${2500 - last.hydration} ml to go`}`,
      positive: last.hydration >= 2500,
    },
    {
      label:    'Calories',
      current:  `${last.calories} kcal`,
      previous: `${first.calories} kcal`,
      change:   `Goal: ${last.calorieGoal} kcal`,
      positive: last.calories <= last.calorieGoal,
    },
  ] : []

  return NextResponse.json({ weekly, metrics })
}
