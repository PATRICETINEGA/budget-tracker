'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AddTransaction() {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const r = useRouter()
  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, type, category, description }) })
    setAmount(''); setCategory(''); setDescription(''); setLoading(false); r.refresh()
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4 space-y-2">
      <div className="flex gap-2">
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" type="number" step="0.01" className="flex-1 border p-2 rounded text-sm" required />
        <select value={type} onChange={e=>setType(e.target.value)} className="border p-2 rounded text-sm">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="w-full border p-2 rounded text-sm" required />
      <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full border p-2 rounded text-sm" />
      <button type="submit" disabled={loading} className="bg-green-700 text-white px-4 py-1 rounded text-sm disabled:opacity-50">Add</button>
    </form>
  )
}
