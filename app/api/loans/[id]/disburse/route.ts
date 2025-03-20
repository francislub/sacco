import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can disburse loans
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const loanId = params.id

    // Get the loan
    const loan = await prisma.loan.findUnique({
      where: {
        id: loanId,
      },
      include: {
        account: true,
      },
    })

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 })
    }

    // Check if loan is in APPROVED status
    if (loan.status !== "APPROVED") {
      return NextResponse.json({ error: "Only approved loans can be disbursed" }, { status: 400 })
    }

    // Start a transaction to update loan status and account balance
    const result = await prisma.$transaction([
      // Create transaction record
      prisma.transaction.create({
        data: {
          type: "LOAN_DISBURSEMENT",
          amount: loan.amount,
          description: `Loan disbursement - ${loan.term} months at ${loan.interestRate}% interest`,
          accountId: loan.accountId,
          userId: loan.userId,
          loanId: loan.id,
        },
      }),

      // Update account balance
      prisma.account.update({
        where: {
          id: loan.accountId,
        },
        data: {
          balance: {
            increment: loan.amount,
          },
        },
      }),

      // Update loan status
      prisma.loan.update({
        where: {
          id: loanId,
        },
        data: {
          status: "DISBURSED",
          disbursedAt: new Date(),
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
              balance: true,
            },
          },
        },
      }),
    ])

    return NextResponse.json(result[2])
  } catch (error) {
    console.error("Error disbursing loan:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

