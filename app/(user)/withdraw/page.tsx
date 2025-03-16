import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WithdrawForm } from "@/components/withdraw-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"

export default async function WithdrawPage() {
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Make a Withdrawal</CardTitle>
            <CardDescription>Current balance: {formatCurrency(account.balance)}</CardDescription>
          </CardHeader>
          <CardContent>
            <WithdrawForm account={account} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

