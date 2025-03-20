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

    // Only admins can reject loans
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const loanId = params.id
    const { reason } = await request.json()

    // Get the loan
    const loan = await prisma.loan.findUnique({
      where: {
        id: loanId,
      },
    })

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 })
    }

    // Check if loan is in PENDING status
    if (loan.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending loans can be rejected" }, { status: 400 })
    }

    // Update loan status to REJECTED
    const updatedLoan = await prisma.loan.update({
      where: {
        id: loanId,
      },
      data: {
        status: "REJECTED",
        purpose: loan.purpose ? `${loan.purpose}\n\nRejection reason: ${reason}` : `Rejection reason: ${reason}`,
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
    })

    return NextResponse.json(updatedLoan)
  } catch (error) {
    console.error("Error rejecting loan:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

