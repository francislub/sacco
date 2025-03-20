import { NextResponse } from "next/server"
import { verifyCode } from "@/lib/verification-code"

export async function POST(req: Request) {
  try {
    const { userId, code, type } = await req.json()

    if (!userId || !code || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the code
    const isValid = await verifyCode(userId, code, type)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    return NextResponse.json({ message: "Verification successful" }, { status: 200 })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

