import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail } from "@/lib/data"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import type { VerificationType } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        // Commenting out verification code field as we're bypassing email verification
        // verificationCode: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing email or password")
            return null
          }

          const user = await getUserByEmail(credentials.email)

          if (!user || !user.password) {
            console.log("User not found or no password")
            return null
          }

          const passwordsMatch = await bcrypt.compare(credentials.password, user.password)

          if (!passwordsMatch) {
            console.log("Passwords don't match")
            return null
          }

          // Commenting out verification code validation
          /*
          // If verification code is provided, validate it
          if (credentials.verificationCode) {
            console.log("Validating verification code:", credentials.verificationCode)

            const isValidCode = await validateVerificationCode(user.id, credentials.verificationCode, "LOGIN")

            if (!isValidCode) {
              console.log("Invalid verification code")
              return null
            }

            console.log("Verification code valid, returning user")
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }

          // If no verification code provided, we need to generate one
          console.log("No verification code provided, generating one")
          await generateAndSendVerificationCode(user.id, user.email, "LOGIN")

          // Return user with requires2FA flag
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            requires2FA: true,
          }
          */

          // Bypass email verification and directly return the user
          console.log("Email verification bypassed, returning user directly")
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            // No requires2FA flag
          }
        } catch (error) {
          console.error("Error in authorize function:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role

        // Commenting out 2FA flag handling
        /*
        // Pass the requires2FA flag to the token
        if ((user as any).requires2FA) {
          token.requires2FA = true
        }
        */
      }
      return token
    },
    async session({ session, token }) {
      // Initialize session.user if it doesn't exist
      if (!session.user) {
        session.user = {}
      }

      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string

        // Commenting out 2FA flag handling
        /*
        // Pass the requires2FA flag to the session
        if (token.requires2FA) {
          ;(session as any).requires2FA = true
        }
        */
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Use environment variables with fallbacks for development
  secret: process.env.NEXTAUTH_SECRET || "your-development-secret-do-not-use-in-production",
  debug: process.env.NODE_ENV === "development",
}

// Helper functions are kept but commented out for future use if needed

// Helper function to validate verification code
async function validateVerificationCode(userId: string, code: string, type: "REGISTER" | "LOGIN" | "PASSWORD_RESET") {
  try {
    console.log(`Validating code for user ${userId}: ${code} (${type})`)

    // Find the verification code in the database
    const verificationCode = await db.verificationCode.findFirst({
      where: {
        userId,
        code,
        type: type as VerificationType,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!verificationCode) {
      console.log("No valid verification code found")
      return false
    }

    console.log("Valid verification code found:", verificationCode.id)

    // Delete the code after use
    await db.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    })

    return true
  } catch (error) {
    console.error("Error validating verification code:", error)
    return false
  }
}

// Helper function to generate and send verification code
async function generateAndSendVerificationCode(
  userId: string,
  email: string,
  type: "REGISTER" | "LOGIN" | "PASSWORD_RESET",
) {
  try {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    console.log(`Generated code for ${email}: ${code}`)

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Delete any existing codes for this user and type
    await db.verificationCode.deleteMany({
      where: {
        userId,
        type: type as VerificationType,
      },
    })

    // Create a new verification code
    const newCode = await db.verificationCode.create({
      data: {
        userId,
        code,
        type: type as VerificationType,
        expiresAt,
      },
    })

    console.log("Created verification code in database:", newCode.id)

    // Send the code via email
    await sendVerificationEmail(email, code, type)

    return true
  } catch (error) {
    console.error("Error generating verification code:", error)
    return false
  }
}

// Helper function to send verification email
async function sendVerificationEmail(email: string, code: string, type: "REGISTER" | "LOGIN" | "PASSWORD_RESET") {
  try {
    console.log(`Sending verification email to ${email} with code ${code}`)

    // Create email subject and content based on type
    let subject, text, html

    switch (type) {
      case "REGISTER":
        subject = "Verify your BUESACCO account"
        text = `Your verification code is: ${code}. Use this code to complete your registration.`
        break
      case "LOGIN":
        subject = "Your BUESACCO login verification code"
        text = `Your login verification code is: ${code}. This code will expire in 10 minutes.`
        break
      case "PASSWORD_RESET":
        subject = "Reset your BUESACCO password"
        text = `Your password reset code is: ${code}. Use this code to reset your password.`
        break
    }

    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${subject}</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 12px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 4px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <p>Thank you,<br>BUESACCO Team</p>
      </div>
    `

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      text,
      html,
    })

    console.log("Email sent:", info.messageId)

    return true
  } catch (error) {
    console.error("Error sending verification email:", error)
    return false
  }
}
