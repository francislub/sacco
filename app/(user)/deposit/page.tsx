import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DepositForm } from "@/components/deposit-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export default async function DepositPage() {
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
      <h1 className="text-2xl font-bold mb-6">Deposit Funds</h1>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Make a Deposit</CardTitle>
            <CardDescription>Add funds to your SACCO account</CardDescription>
          </CardHeader>
          <CardContent>
            <DepositForm account={account} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

