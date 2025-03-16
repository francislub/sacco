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

    // If admin, can view all transactions or filter by userId
    // If regular user, can only view their own transactions
    const where =
      (session.user as any).role === "ADMIN" ? (userId ? { userId } : {}) : { userId: (session.user as any).id }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        account: {
          select: {
            accountNumber: true,
          },
        },
      },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, amount, description, accountId } = await request.json()

    // Validate transaction data
    if (!type || !amount || !accountId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get account
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Only allow users to create transactions for their own account or admins for any account
    if ((session.user as any).role !== "ADMIN" && account.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Process transaction based on type
    let updatedBalance = account.balance

    if (type === "DEPOSIT") {
      updatedBalance += amount
    } else if (type === "WITHDRAW") {
      if (account.balance < amount) {
        return NextResponse.json({ error: "Insufficient funds" }, { status: 400 })
      }
      updatedBalance -= amount
    } else if (type === "TRANSFER") {
      // Transfer logic would be more complex and require a recipient account
      return NextResponse.json({ error: "Transfer not implemented in this endpoint" }, { status: 400 })
    }

    // Create transaction and update account balance in a transaction
    const result = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          type,
          amount,
          description: description || "",
          accountId,
          userId: account.userId,
        },
      }),
      prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          balance: updatedBalance,
        },
      }),
    ])

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

