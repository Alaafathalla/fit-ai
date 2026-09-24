import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const WORKOUT_TYPES = new Set(['Strength', 'Cardio', 'Mobility', 'HIIT'])

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  if (type && type !== 'All' && !WORKOUT_TYPES.has(type)) {
    return NextResponse.json({ error: 'Invalid workout type' }, { status: 400 })
  }

  const workouts = await prisma.workout.findMany({
    where: type && type !== 'All' ? { type: type as 'Strength' | 'Cardio' | 'Mobility' | 'HIIT' } : undefined,
    orderBy: [{ completedCount: 'desc' }, { title: 'asc' }],
  })

  return NextResponse.json(workouts)
}
