"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

interface Transaction {
  id: string
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER"
  amount: number
  description: string
  createdAt: string
  user: {
    name: string
  } | null
}

interface AccountTransactionsProps {
  accountId: string
}

export function AccountTransactions({ accountId }: AccountTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/accounts/${accountId}/transactions`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch transactions")
        }

        const data = await response.json()
        setTransactions(data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        setError("Failed to load transactions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [accountId])

  if (isLoading) {
    return <div className="text-center py-4">Loading transactions...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{transaction.user?.name || "Unknown"}</TableCell>
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

