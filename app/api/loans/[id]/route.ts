import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const loanId = params.id

    // Get the loan
    const loan = await prisma.loan.findUnique({
      where: {
        id: loanId,
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

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 })
    }

    // Check if user is authorized to view this loan
    if (session.user.role !== "ADMIN" && loan.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(loan)
  } catch (error) {
    console.error("Error fetching loan:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

