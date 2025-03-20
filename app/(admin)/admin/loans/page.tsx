import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function AdminLoansPage() {
  // Get all loans
  const loans = await prisma.loan.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      account: {
        select: {
          accountNumber: true,
        },
      },
    },
  })

  // Calculate loan statistics
  const pendingLoans = loans.filter((loan) => loan.status === "PENDING")
  const approvedLoans = loans.filter((loan) => loan.status === "APPROVED")
  const disbursedLoans = loans.filter((loan) => loan.status === "DISBURSED")

  const totalPending = pendingLoans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalDisbursed = disbursedLoans.reduce((sum, loan) => sum + loan.amount, 0)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Loan Management</h1>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLoans.length}</div>
            <p className="text-xs text-muted-foreground">Total: {formatCurrency(totalPending)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLoans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disbursedLoans.length}</div>
            <p className="text-xs text-muted-foreground">Total: {formatCurrency(totalDisbursed)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No loans found
                  </TableCell>
                </TableRow>
              ) : (
                loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{loan.user.name}</TableCell>
                    <TableCell>{loan.account.accountNumber}</TableCell>
                    <TableCell>{formatCurrency(loan.amount)}</TableCell>
                    <TableCell>{loan.term} months</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          loan.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : loan.status === "APPROVED"
                              ? "bg-blue-100 text-blue-800"
                              : loan.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : loan.status === "DISBURSED"
                                  ? "bg-green-100 text-green-800"
                                  : loan.status === "PAID"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/loans/${loan.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

