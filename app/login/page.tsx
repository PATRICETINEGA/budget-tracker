'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const r = useRouter()
  async function submit(e: any) {
    e.preventDefault()
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) setErr('Invalid')
    else { r.push('/dashboard'); r.refresh() }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">Budget Tracker</h1>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" required />
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button className="w-full bg-green-700 text-white p-2 rounded">Sign in</button>
        <p className="text-xs text-center text-gray-500">demo@budget.app / demo123</p>
      </form>
    </div>
  )
}
