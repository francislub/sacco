import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { compareSync } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        isVerified: true,
        twoFactorEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = compareSync(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Comment out 2FA check - allow all users to login directly
    /*
    if (user.twoFactorEnabled) {
      // Generate and send verification code
      // This would normally send an email with the code
      
      return NextResponse.json({
        userId: user.id,
        requires2FA: true,
        role: user.role,
      })
    }
    */

    // Return user info without requiring 2FA
    return NextResponse.json({
      userId: user.id,
      requires2FA: false, // Always set to false to bypass 2FA
      role: user.role,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
