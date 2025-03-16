import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import prisma from "@/lib/prisma"
import { AdminWithdrawForm } from "@/components/admin-withdraw-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminWithdrawalsPage() {
  // Get all withdrawal transactions
  const withdrawals = await prisma.transaction.findMany({
    where: {
      type: "WITHDRAW",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      account: {
        select: {
          accountNumber: true,
        },
      },
    },
    take: 50, // Limit to 50 most recent withdrawals
  })

  // Calculate total withdrawals
  const totalWithdrawals = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Withdrawals</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalWithdrawals)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Number of Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withdrawals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Withdrawal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {withdrawals.length > 0 ? formatCurrency(totalWithdrawals / withdrawals.length) : formatCurrency(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Withdrawals</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No withdrawals found
                    </TableCell>
                  </TableRow>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>{new Date(withdrawal.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{withdrawal.user.name}</TableCell>
                      <TableCell>{withdrawal.account.accountNumber}</TableCell>
                      <TableCell>{withdrawal.description || "-"}</TableCell>
                      <TableCell className="text-right">{formatCurrency(withdrawal.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Process a Withdrawal</h2>
          <Card>
            <CardContent className="pt-6">
              <AdminWithdrawForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

