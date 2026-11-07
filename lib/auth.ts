import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({
    name: 'credentials',
    credentials: { email: {}, password: {} },
    async authorize(c) {
      if (!c?.email || !c?.password) return null
      const u = await prisma.user.findUnique({ where: { email: c.email } })
      if (!u || !(await bcrypt.compare(c.password, u.password))) return null
      return { id: u.id, email: u.email }
    }
  })],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) { if (user) token.id = user.id; return token },
    async session({ session, token }) { if (session.user) (session.user as any).id = token.id as any; return session }
  },
  pages: { signIn: '/login' }
}
