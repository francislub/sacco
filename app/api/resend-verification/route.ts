import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createAndSendVerificationCode } from "@/lib/verification-code"

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json()

    if (!email || !type) {
      return NextResponse.json({ error: "Email and type are required" }, { status: 400 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return NextResponse.json({ message: "If your email exists, a verification code has been sent" }, { status: 200 })
    }

    // Create and send a new verification code
    await createAndSendVerificationCode(user.id, user.email, type as "REGISTRATION" | "LOGIN" | "PASSWORD_RESET")

    return NextResponse.json({ message: "Verification code has been sent" }, { status: 200 })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

