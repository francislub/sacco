"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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
    balance: number
  }
  user: {
    name: string
    email: string
  }
}

export default function AdminLoanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loan, setLoan] = useState<Loan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionForm, setShowRejectionForm] = useState(false)

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

  const handleApproveLoan = async () => {
    if (!loan) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/loans/${loan.id}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to approve loan")
      }

      toast({
        title: "Loan Approved",
        description: "The loan has been approved successfully.",
      })

      // Refresh loan data
      const updatedLoan = await response.json()
      setLoan(updatedLoan)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve loan",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectLoan = async () => {
    if (!loan) return

    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch(`/api/loans/${loan.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: rejectionReason,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to reject loan")
      }

      toast({
        title: "Loan Rejected",
        description: "The loan has been rejected.",
      })

      // Refresh loan data
      const updatedLoan = await response.json()
      setLoan(updatedLoan)
      setShowRejectionForm(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject loan",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDisburseLoan = async () => {
    if (!loan) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/loans/${loan.id}/disburse`, {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to disburse loan")
      }

      toast({
        title: "Loan Disbursed",
        description: "The loan has been disbursed to the member's account.",
      })

      // Refresh loan data
      const updatedLoan = await response.json()
      setLoan(updatedLoan)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disburse loan",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

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
        <Link href="/admin/loans">
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
            <CardTitle>Member Information</CardTitle>
            <CardDescription>Details of the loan applicant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Name</span>
              <span className="font-semibold">{loan.user.name}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="font-semibold">{loan.user.email}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Account Number</span>
              <span className="font-semibold">{loan.account.accountNumber}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium text-gray-500">Account Balance</span>
              <span className="font-semibold">{formatCurrency(loan.account.balance)}</span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Loan Purpose</h3>
              <div className="p-3 bg-gray-50 rounded-md min-h-[80px]">{loan.purpose || "No purpose specified"}</div>
            </div>
          </CardContent>

          {loan.status === "PENDING" && (
            <CardFooter className="flex flex-col gap-3">
              {showRejectionForm ? (
                <div className="w-full space-y-3">
                  <Label htmlFor="rejectionReason">Reason for Rejection</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejecting this loan application"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowRejectionForm(false)} disabled={actionLoading}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleRejectLoan} disabled={actionLoading}>
                      {actionLoading ? "Processing..." : "Confirm Rejection"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 w-full">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setShowRejectionForm(true)}
                    disabled={actionLoading}
                  >
                    Reject Loan
                  </Button>
                  <Button variant="default" className="flex-1" onClick={handleApproveLoan} disabled={actionLoading}>
                    {actionLoading ? "Processing..." : "Approve Loan"}
                  </Button>
                </div>
              )}
            </CardFooter>
          )}

          {loan.status === "APPROVED" && (
            <CardFooter>
              <Button className="w-full" onClick={handleDisburseLoan} disabled={actionLoading}>
                {actionLoading ? "Processing..." : "Disburse Loan"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

