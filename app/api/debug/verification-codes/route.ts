import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Not available in production" }, { status: 403 })
    }

    // Get the session
    const session = await getServerSession(authOptions)

    // Only allow admins
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all verification codes
    const codes = await db.verificationCode.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      count: codes.length,
      codes: codes.map((code) => ({
        id: code.id,
        userId: code.userId,
        userEmail: code.user.email,
        code: code.code,
        type: code.type,
        expiresAt: code.expiresAt,
        createdAt: code.createdAt,
        isExpired: code.expiresAt < new Date(),
      })),
    })
  } catch (error) {
    console.error("Error getting verification codes:", error)
    return NextResponse.json({ error: "Failed to get verification codes" }, { status: 500 })
  }
}

