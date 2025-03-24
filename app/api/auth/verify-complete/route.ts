import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail } from "@/lib/data"
import { encode } from "next-auth/jwt"

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "User ID and email are required" }, { status: 400 })
    }

    // Find the user
    const user = await getUserByEmail(email)

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 })
    }

    // Create a session token
    const token = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.image,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    })

    // Set the session cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "next-auth.session-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    // Return success with user role for redirection
    return NextResponse.json({
      success: true,
      role: user.role,
    })
  } catch (error) {
    console.error("Verification completion error:", error)
    return NextResponse.json({ error: "An error occurred during verification completion" }, { status: 500 })
  }
}

