import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import prisma from "@/lib/prisma"
import { AdminTransferForm } from "@/components/admin-transfer-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminTransfersPage() {
  // Get all transfer transactions (we'll identify them by description containing "Transfer")
  const transfers = await prisma.transaction.findMany({
    where: {
      description: {
        contains: "Transfer",
      },
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
    take: 50, // Limit to 50 most recent transfers
  })

  // Calculate total transfers
  const totalTransfers = transfers.length / 2 // Each transfer creates 2 transactions

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transfers</h1>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransfers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Transfer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transfers.length > 0 ? new Date(transfers[0].createdAt).toLocaleDateString() : "No transfers yet"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Transfers</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From/To</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No transfers found
                    </TableCell>
                  </TableRow>
                ) : (
                  transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>{new Date(transfer.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{transfer.user.name}</TableCell>
                      <TableCell>{transfer.account.accountNumber}</TableCell>
                      <TableCell>{transfer.description || "-"}</TableCell>
                      <TableCell
                        className={`text-right ${transfer.type === "DEPOSIT" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transfer.type === "DEPOSIT" ? "+" : "-"}
                        {formatCurrency(transfer.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Process a Transfer</h2>
          <Card>
            <CardContent className="pt-6">
              <AdminTransferForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

