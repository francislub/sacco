import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransferForm } from "@/components/transfer-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"

export default async function TransferPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const userId = (session.user as any).id

  // Get user account
  const account = await prisma.account.findUnique({
    where: {
      userId,
    },
  })

  if (!account) {
    return <div>Account not found</div>
  }

  // Get all other accounts for transfer
  type AccountWithUser = {
    id: string
    accountNumber: string
    balance: number
    userId: string | null
    createdAt: Date
    updatedAt: Date
    user: { name: string }
  }

  const otherAccounts = await prisma.account.findMany({
    where: {
      userId: {
        not: userId,
      },
      NOT: {
        userId: null
      }
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  }) as AccountWithUser[]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transfer Funds</h1>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Make a Transfer</CardTitle>
            <CardDescription>Current balance: {formatCurrency(account.balance)}</CardDescription>
          </CardHeader>
          <CardContent>
            <TransferForm account={account} otherAccounts={otherAccounts} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

