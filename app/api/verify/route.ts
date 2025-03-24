import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { userId, code, type } = await request.json()

    if (!userId || !code || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the verification code in the database
    const verificationCode = await db.verificationCode.findFirst({
      where: {
        userId,
        code,
        type,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    })

    if (!verificationCode) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    // Delete the code after use
    await db.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    })

    // Return success with user info for redirection
    return NextResponse.json({
      success: true,
      user: {
        id: verificationCode.user.id,
        email: verificationCode.user.email,
        role: verificationCode.user.role,
      },
    })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
  }
}

