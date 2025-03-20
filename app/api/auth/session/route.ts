import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      requires2FA: (session as any).requires2FA || false,
      expires: session.expires,
    })
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 })
  }
}

