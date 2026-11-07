import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@budget.app' },
    update: {},
    create: { email: 'demo@budget.app', password },
  })

  await prisma.transaction.upsert({
    where: { id: 'seed-tx' },
    update: {},
    create: { id: 'seed-tx', amount: 2500, type: 'income', category: 'Salary', description: 'Monthly', date: '2026-11-01', ownerId: user.id },
  })

  console.log('Seed done')
}

main().finally(() => prisma.$disconnect())
