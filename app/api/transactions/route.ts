import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { amount, type, category, description, date } = body
  if (!amount || !type || !category) return NextResponse.json({ error: 'Amount, type and category required' }, { status: 400 })

  const tx = await prisma.transaction.create({
    data: { amount: parseFloat(amount), type, category, description, date: date || new Date().toISOString().slice(0,10), ownerId: (session.user as any).id },
  })
  return NextResponse.json(tx)
}
