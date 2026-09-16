import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

const Schema = z.object({ hydration: z.number().int().min(0).max(5000) })

export async function PATCH(req: Request) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const today = new Date(); today.setHours(0, 0, 0, 0)

  const stat = await prisma.dailyStats.upsert({
    where: { userId_date: { userId: USER_ID, date: today } },
    update: { hydration: parsed.data.hydration },
    create: { userId: USER_ID, date: today, calorieGoal: 2000, hydration: parsed.data.hydration },
  })

  return NextResponse.json({ ok: true, hydration: stat.hydration })
}
