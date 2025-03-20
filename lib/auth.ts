import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import prisma from "@/lib/prisma"
import { createAndSendVerificationCode } from "@/lib/verification-code"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        verificationCode: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // For admin users, we don't require 2FA
        if (user.role === "ADMIN") {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        // For regular users, check verification code
        if (!credentials.verificationCode) {
          // If no verification code provided, send one and return null
          await createAndSendVerificationCode(user.id, user.email, "LOGIN")
          // Return a special object to indicate 2FA is required
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            requires2FA: true,
          }
        }

        // Verify the code
        const isCodeValid = await prisma.verificationCode.findFirst({
          where: {
            userId: user.id,
            code: credentials.verificationCode,
            type: "LOGIN",
            used: false,
            expiresAt: {
              gt: new Date(),
            },
          },
        })

        if (!isCodeValid) {
          return null
        }

        // Mark the code as used
        await prisma.verificationCode.update({
          where: {
            id: isCodeValid.id,
          },
          data: {
            used: true,
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        // If 2FA is required, add a flag to the token
        if ((user as any).requires2FA) {
          token.requires2FA = true
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        // If 2FA is required, add a flag to the session
        if (token.requires2FA) {
          ;(session as any).requires2FA = true
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production",
}

