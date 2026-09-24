import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() })
  } catch {
    return NextResponse.json(
      { status: 'degraded', database: 'unavailable', timestamp: new Date().toISOString() },
      { status: 503 },
    )
  }
}
