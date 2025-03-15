import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const userId = (session.user as any).id

  // Get user transactions
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={
                        transaction.type === "DEPOSIT"
                          ? "text-green-600"
                          : transaction.type === "WITHDRAW"
                            ? "text-red-600"
                            : "text-blue-600"
                      }
                    >
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.description || "-"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

