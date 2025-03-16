import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    })

    // Generate account number (simple implementation)
    const accountNumber = Math.floor(100000 + Math.random() * 900000).toString()

    // Create account for user
    await prisma.account.create({
      data: {
        accountNumber,
        userId: user.id,
        balance: 0,
      },
    })

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

