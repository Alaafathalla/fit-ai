import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const requested = Number.parseInt(searchParams.get('limit') ?? '30', 10)
  const limit = Number.isFinite(requested) ? Math.max(1, Math.min(100, requested)) : 30

  const [sessions, mealLogs] = await Promise.all([
    prisma.workoutSession.findMany({
      where: { userId: USER_ID },
      orderBy: { completedAt: 'desc' },
      take: limit,
      include: {
        workout: {
          select: { title: true, type: true, duration: true, calories: true, image: true },
        },
      },
    }),
    prisma.mealLog.findMany({
      where: { userId: USER_ID },
      orderBy: { loggedAt: 'desc' },
      take: limit,
      include: {
        meal: {
          select: { name: true, mealType: true, calories: true, image: true },
        },
      },
    }),
  ])

  const activity = [
    ...sessions.map((session) => ({
      id: `workout-${session.id}`,
      kind: 'workout' as const,
      title: session.workout.title,
      subtitle: `${session.workout.type} workout`,
      timestamp: session.completedAt.toISOString(),
      calories: session.workout.calories,
      duration: session.duration ?? session.workout.duration,
      image: session.workout.image,
    })),
    ...mealLogs.map((log) => ({
      id: `meal-${log.id}`,
      kind: 'meal' as const,
      title: log.meal.name,
      subtitle: `${log.meal.mealType} logged`,
      timestamp: log.loggedAt.toISOString(),
      calories: log.meal.calories,
      image: log.meal.image,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)

  return NextResponse.json(activity)
}
