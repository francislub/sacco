import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, description, fromAccountId, toAccountId } = await request.json()

    // Validate transaction data
    if (!amount || !fromAccountId || !toAccountId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get source account
    const fromAccount = await prisma.account.findUnique({
      where: {
        id: fromAccountId,
      },
    })

    if (!fromAccount) {
      return NextResponse.json({ error: "Source account not found" }, { status: 404 })
    }

    // Only allow users to transfer from their own account or admins for any account
    if ((session.user as any).role !== "ADMIN" && fromAccount.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if user has sufficient funds
    if (fromAccount.balance < amount) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 })
    }

    // Get destination account
    const toAccount = await prisma.account.findUnique({
      where: {
        id: toAccountId,
      },
    })

    if (!toAccount) {
      return NextResponse.json({ error: "Destination account not found" }, { status: 404 })
    }

    // Process transfer in a transaction
    const result = await prisma.$transaction([
      // Create withdrawal transaction for source account
      prisma.transaction.create({
        data: {
          type: "WITHDRAW",
          amount,
          description: description || `Transfer to account ${toAccount.accountNumber}`,
          accountId: fromAccountId,
          userId: fromAccount.userId ?? "",
        },
      }),
      // Create deposit transaction for destination account
      prisma.transaction.create({
        data: {
          type: "DEPOSIT",
          amount,
          description: description || `Transfer from account ${fromAccount.accountNumber}`,
          accountId: toAccountId,
          userId: toAccount.userId ?? "",
        },
      }),
      // Update source account balance
      prisma.account.update({
        where: {
          id: fromAccountId,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),
      // Update destination account balance
      prisma.account.update({
        where: {
          id: toAccountId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
    ])

    return NextResponse.json({ message: "Transfer successful" }, { status: 200 })
  } catch (error) {
    console.error("Error processing transfer:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

