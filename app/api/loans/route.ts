import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // If admin, can view all loans or filter by userId
    // If regular user, can only view their own loans
    const where = session.user.role === "ADMIN" ? (userId ? { userId } : {}) : { userId: session.user.id }

    const loans = await prisma.loan.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        account: {
          select: {
            accountNumber: true,
          },
        },
      },
    })

    return NextResponse.json(loans)
  } catch (error) {
    console.error("Error fetching loans:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, term, interestRate, purpose } = await request.json()

    // Validate loan data
    if (!amount || !term || !interestRate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user account
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Calculate due date (term months from now)
    const dueDate = new Date()
    dueDate.setMonth(dueDate.getMonth() + term)

    // Create loan
    const loan = await prisma.loan.create({
      data: {
        amount,
        interestRate,
        term,
        purpose,
        status: "PENDING",
        accountId: account.id,
        userId: session.user.id,
        dueDate,
      },
    })

    return NextResponse.json(loan, { status: 201 })
  } catch (error) {
    console.error("Error creating loan:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

