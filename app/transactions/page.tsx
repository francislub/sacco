import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

export default function TransactionsPage() {
  // This would be replaced with real data from your database
  const transactions = [
    {
      id: "1",
      dateCreated: "2023-05-09 12:12:32",
      type: "Withdraw",
      amount: 5000.0,
    },
    {
      id: "2",
      dateCreated: "2023-05-09 12:05:09",
      type: "Withdraw",
      amount: 250.0,
    },
    {
      id: "3",
      dateCreated: "2023-05-09 12:03:42",
      type: "Beginning balance",
      amount: 300.0,
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date Created</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.dateCreated}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

