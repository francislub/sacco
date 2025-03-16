import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { UserTransactions } from "@/components/user-transactions"

interface UserPageProps {
  params: {
    id: string
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const userId = params.id

  // Get user with account
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      account: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Link href="/admin/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-lg">{user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1 text-lg">{user.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
              <p className="mt-1 text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.account ? (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
                  <p className="mt-1 text-lg">{user.account.accountNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
                  <p className="mt-1 text-lg font-semibold">{formatCurrency(user.account.balance)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                  <p className="mt-1 text-lg">{new Date(user.account.createdAt).toLocaleDateString()}</p>
                </div>
              </>
            ) : (
              <p>No account found for this user.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <UserTransactions userId={userId} />
      </div>
    </div>
  )
}

