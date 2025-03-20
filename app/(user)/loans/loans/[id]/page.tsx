"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

interface Loan {
  id: string
  amount: number
  interestRate: number
  term: number
  status: string
  purpose: string
  createdAt: string
  dueDate: string
  approvedAt: string | null
  disbursedAt: string | null
  account: {
    accountNumber: string
  }
}

export default function LoanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loan, setLoan] = useState<Loan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const response = await fetch(`/api/loans/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch loan details")
        }

        const data = await response.json()
        setLoan(data)
      } catch (error) {
        console.error("Error fetching loan:", error)
        setError("Failed to load loan details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoan()
  }, [params.id])

  if (isLoading) {
    return <div className="p-6 text-center">Loading loan details...</div>
  }

  if (error || !loan) {
    return <div className="p-6 text-center text-red-500">{error || "Loan not found"}</div>
  }

  // Calculate loan details
  const monthlyInterestRate = loan.interestRate / 100 / 12
  const monthlyPayment =
    (loan.amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loan.term)) /
    (Math.pow(1 + monthlyInterestRate, loan.term) - 1)
  const totalPayment = monthlyPayment * loan.term
  const totalInterest = totalPayment - loan.amount

  // Get status icon
  const getStatusIcon = () => {
    switch (loan.status) {
      case "PENDING":
        return <Clock className="h-8 w-8 text-yellow-500" />
      case "APPROVED":
      case "DISBURSED":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "REJECTED":
        return <XCircle className="h-8 w-8 text-red-500" />
      default:
        return <Clock className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/loans">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loans
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Loan Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Loan Summary</CardTitle>
                <CardDescription>Application date: {new Date(loan.createdAt).toLocaleDateString()}</CardDescription>
              </div>
              {getStatusIcon()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Status</span>
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
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Loan Amount</span>
              <span className="font-semibold">{formatCurrency(loan.amount)}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Interest Rate</span>
              <span className="font-semibold">{loan.interestRate}% per annum</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Term</span>
              <span className="font-semibold">{loan.term} months</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Monthly Payment</span>
              <span className="font-semibold">{formatCurrency(monthlyPayment)}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Total Interest</span>
              <span className="font-semibold">{formatCurrency(totalInterest)}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Total Repayment</span>
              <span className="font-semibold">{formatCurrency(totalPayment)}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Account Number</span>
              <span className="font-semibold">{loan.account.accountNumber}</span>
            </div>

            {loan.dueDate && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium text-gray-500">Due Date</span>
                <span className="font-semibold">{new Date(loan.dueDate).toLocaleDateString()}</span>
              </div>
            )}

            {loan.approvedAt && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium text-gray-500">Approved Date</span>
                <span className="font-semibold">{new Date(loan.approvedAt).toLocaleDateString()}</span>
              </div>
            )}

            {loan.disbursedAt && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium text-gray-500">Disbursed Date</span>
                <span className="font-semibold">{new Date(loan.disbursedAt).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Purpose</CardTitle>
            <CardDescription>Why you applied for this loan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-md min-h-[100px]">{loan.purpose || "No purpose specified"}</div>

            {loan.status === "PENDING" && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="text-sm font-semibold text-yellow-800">Application Under Review</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your loan application is currently being reviewed by our team. You will be notified once a decision
                  has been made.
                </p>
              </div>
            )}

            {loan.status === "APPROVED" && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-sm font-semibold text-blue-800">Loan Approved</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Congratulations! Your loan has been approved. The funds will be disbursed to your account soon.
                </p>
              </div>
            )}

            {loan.status === "REJECTED" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <h3 className="text-sm font-semibold text-red-800">Loan Rejected</h3>
                <p className="text-sm text-red-700 mt-1">
                  We regret to inform you that your loan application has been rejected. Please contact the SACCO office
                  for more information.
                </p>
              </div>
            )}

            {loan.status === "DISBURSED" && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-sm font-semibold text-green-800">Loan Disbursed</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your loan has been disbursed to your account. Please check your account balance.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {loan.status === "DISBURSED" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Repayment Schedule</CardTitle>
            <CardDescription>Monthly payments for your loan</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment #</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Payment Amount</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: loan.term }).map((_, index) => {
                  // Calculate payment details for this month
                  const paymentNumber = index + 1
                  const paymentDate = new Date(loan.disbursedAt || loan.createdAt)
                  paymentDate.setMonth(paymentDate.getMonth() + paymentNumber)

                  // Calculate remaining balance
                  const remainingPayments = loan.term - index
                  const remainingBalance =
                    monthlyPayment * remainingPayments - (monthlyPayment - loan.amount / loan.term)

                  // Calculate principal and interest for this payment
                  const interestPayment = (remainingBalance + loan.amount / loan.term) * monthlyInterestRate
                  const principalPayment = monthlyPayment - interestPayment

                  return (
                    <TableRow key={index}>
                      <TableCell>{paymentNumber}</TableCell>
                      <TableCell>{paymentDate.toLocaleDateString()}</TableCell>
                      <TableCell>{formatCurrency(monthlyPayment)}</TableCell>
                      <TableCell>{formatCurrency(principalPayment)}</TableCell>
                      <TableCell>{formatCurrency(interestPayment)}</TableCell>
                      <TableCell>{formatCurrency(Math.max(0, remainingBalance - principalPayment))}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

