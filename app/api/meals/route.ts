import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

const MEAL_TYPES = new Set(['Breakfast', 'Lunch', 'Dinner', 'Snack'])

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const mealType = searchParams.get('mealType')

  if (mealType && mealType !== 'All' && !MEAL_TYPES.has(mealType)) {
    return NextResponse.json({ error: 'Invalid meal type' }, { status: 400 })
  }

  const meals = await prisma.meal.findMany({
    where: mealType && mealType !== 'All'
      ? { mealType: mealType as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' }
      : undefined,
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(meals)
}
