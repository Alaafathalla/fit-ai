import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const mealType = searchParams.get('mealType')

  const meals = await prisma.meal.findMany({
    where: mealType && mealType !== 'All' ? { mealType: mealType as any } : undefined,
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(meals)
}
