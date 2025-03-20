import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { AccountTransactions } from "@/components/account-transactions"

interface AccountPageProps {
  params: {
    id: string
  }
}

export default async function AccountPage({ params }: AccountPageProps) {
  const accountId = params.id

  // Get account with user
  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
    include: {
      user: true,
    },
  })

  if (!account) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Account Details</h1>
        <Link href="/admin/accounts">
          <Button variant="outline">Back to Accounts</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
              <p className="mt-1 text-lg">{account.accountNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(account.balance)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
              <p className="mt-1 text-lg">{new Date(account.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {account.user ? (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 text-lg">{account.user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg">{account.user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="mt-1 text-lg">{account.user.role}</p>
                </div>
                <div>
                  <Link href={`/admin/users/${account.user.id}`}>
                    <Button variant="outline">View Member Profile</Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-4 bg-yellow-50 rounded-md">
                <p className="text-yellow-800">This account is not associated with any user.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <AccountTransactions accountId={accountId} />
      </div>
    </div>
  )
}

