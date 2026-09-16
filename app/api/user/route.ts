import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

export async function GET() {
  const user = await prisma.user.findUnique({ where: { id: USER_ID } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarInitials: user.avatarInitials,
    avatarColor: user.avatarColor,
    plan: user.plan,
    goal: user.goal,
    currentWeight: user.currentWeight,
    targetWeight: user.targetWeight,
    streak: user.streak,
    fitnessScore: user.fitnessScore,
    joinedAt: user.createdAt.toISOString().split('T')[0],
  })
}

const UpdateSchema = z.object({
  name:          z.string().min(1).optional(),
  email:         z.string().email().optional(),
  goal:          z.string().optional(),
  currentWeight: z.number().positive().optional(),
  targetWeight:  z.number().positive().optional(),
})

export async function PATCH(req: Request) {
  const body = await req.json()
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const updated = await prisma.user.update({
    where: { id: USER_ID },
    data: parsed.data,
  })

  return NextResponse.json({ ok: true, name: updated.name })
}
