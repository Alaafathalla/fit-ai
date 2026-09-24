import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const USER_ID = process.env.FITAI_USER_ID ?? process.env.NEXT_PUBLIC_USER_ID ?? 'u1'

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
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().email().max(160).optional(),
  goal: z.string().trim().max(240).optional(),
  currentWeight: z.number().min(20).max(500).optional(),
  targetWeight: z.number().min(20).max(500).optional(),
})

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Please check the profile fields and try again.' }, { status: 400 })

  try {
    const updateData = { ...parsed.data } as typeof parsed.data & { avatarInitials?: string }
    if (parsed.data.name) {
      updateData.avatarInitials = parsed.data.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
    }

    const updated = await prisma.user.update({
      where: { id: USER_ID },
      data: updateData,
    })
    return NextResponse.json({ ok: true, name: updated.name })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'That email address is already in use.' }, { status: 409 })
    }
    throw error
  }
}
