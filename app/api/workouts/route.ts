import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  const workouts = await prisma.workout.findMany({
    where: type && type !== 'All' ? { type: type as any } : undefined,
    orderBy: { completedCount: 'desc' },
  })

  return NextResponse.json(workouts)
}
