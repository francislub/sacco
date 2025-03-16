import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import prisma from "@/lib/prisma"
import { AdminDepositForm } from "@/components/admin-deposit-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDepositsPage() {
  // Get all deposit transactions
  const deposits = await prisma.transaction.findMany({
    where: {
      type: "DEPOSIT",
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
    take: 50, // Limit to 50 most recent deposits
  })

  // Calculate total deposits
  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deposits</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDeposits)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Number of Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deposits.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deposits.length > 0 ? formatCurrency(totalDeposits / deposits.length) : formatCurrency(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Deposits</h2>
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
                {deposits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No deposits found
                    </TableCell>
                  </TableRow>
                ) : (
                  deposits.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell>{new Date(deposit.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{deposit.user.name}</TableCell>
                      <TableCell>{deposit.account.accountNumber}</TableCell>
                      <TableCell>{deposit.description || "-"}</TableCell>
                      <TableCell className="text-right">{formatCurrency(deposit.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Make a Deposit</h2>
          <Card>
            <CardContent className="pt-6">
              <AdminDepositForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

