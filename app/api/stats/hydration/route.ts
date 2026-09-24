import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'
const Schema = z.object({ hydration: z.number().int().min(0).max(10_000) })

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Hydration must be between 0 and 10,000 ml' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: USER_ID }, select: { calorieGoal: true } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const stat = await prisma.dailyStats.upsert({
    where: { userId_date: { userId: USER_ID, date: today } },
    update: { hydration: parsed.data.hydration },
    create: { userId: USER_ID, date: today, calorieGoal: user.calorieGoal, hydration: parsed.data.hydration },
  })

  return NextResponse.json({ ok: true, hydration: stat.hydration })
}
