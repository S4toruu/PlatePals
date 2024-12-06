import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Local',
      credentials: {
        mail: { label: 'Email', type: 'text', placeholder: 'Email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { mail, password } = credentials

        // Retrieve the user from the database
        const user = await prisma.user.findUnique({
          where: { mail }
        })

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        // Return the user object if the password is valid
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.mail
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore
      session.id = token.sub
      return session
    }
  }
}

export default NextAuth(authOptions)
