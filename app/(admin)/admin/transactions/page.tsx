import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import prisma from "@/lib/prisma"
import { TransactionFilters } from "@/components/transaction-filters"

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const type = searchParams.type as string | undefined
  const startDate = searchParams.startDate as string | undefined
  const endDate = searchParams.endDate as string | undefined

  // Build filter conditions
  const where: any = {}

  if (type) {
    where.type = type
  }

  if (startDate || endDate) {
    where.createdAt = {}

    if (startDate) {
      where.createdAt.gte = new Date(startDate)
    }

    if (endDate) {
      // Add one day to include the end date fully
      const endDateObj = new Date(endDate)
      endDateObj.setDate(endDateObj.getDate() + 1)
      where.createdAt.lte = endDateObj
    }
  }

  // Get transactions with filters
  const transactions = await prisma.transaction.findMany({
    where,
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
    take: 100, // Limit to 100 most recent transactions
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <TransactionFilters />

      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{transaction.user.name}</TableCell>
                  <TableCell>{transaction.account.accountNumber}</TableCell>
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

