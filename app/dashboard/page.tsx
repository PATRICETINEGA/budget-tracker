import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AddTransaction from '@/components/AddTransaction'
export default async function Dash() {
  const s = await getSession()
  if (!s) redirect('/login')
  const uid = (s.user as any).id
  const txs = await prisma.transaction.findMany({ where: { ownerId: uid }, orderBy: { date: 'desc' } })
  const income = txs.filter((t: any) => t.type === 'income').reduce((a: number, t: any) => a + t.amount, 0)
  const expense = txs.filter((t: any) => t.type === 'expense').reduce((a: number, t: any) => a + t.amount, 0)
  const balance = income - expense
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Budget</h1>
        <Link href="/api/auth/signout" className="text-sm text-red-600">Sign out</Link>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-3 rounded shadow text-center"><p className="text-xs text-gray-500">Income</p><p className="font-bold text-green-600">${income.toFixed(2)}</p></div>
        <div className="bg-white p-3 rounded shadow text-center"><p className="text-xs text-gray-500">Expense</p><p className="font-bold text-red-600">${expense.toFixed(2)}</p></div>
        <div className="bg-white p-3 rounded shadow text-center"><p className="text-xs text-gray-500">Balance</p><p className="font-bold">${balance.toFixed(2)}</p></div>
      </div>
      <AddTransaction />
      <div className="space-y-2">
        {txs.map((t: any) => (
          <div key={t.id} className="bg-white p-3 rounded shadow flex justify-between text-sm">
            <div><span className="font-medium">{t.category}</span> {t.description && <span className="text-gray-500">· {t.description}</span>}<p className="text-xs text-gray-400">{t.date}</p></div>
            <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span>
          </div>
        ))}
        {txs.length === 0 && <p className="text-gray-500">No transactions yet</p>}
      </div>
    </div>
  )
}
