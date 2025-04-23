"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

export default function LoanApplicationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [amount, setAmount] = useState(1000000) // Default 1,000,000 UGX
  const [term, setTerm] = useState(12) // Default 12 months
  const [purpose, setPurpose] = useState("")
  const [loanType, setLoanType] = useState("personal")

  // Interest rate is fixed at 15% per annum for personal loans, 12% for education
  const interestRate = loanType === "education" ? 12 : 15

  // Calculate monthly payment
  const monthlyInterestRate = interestRate / 100 / 12
  const monthlyPayment =
    (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term)) /
    (Math.pow(1 + monthlyInterestRate, term) - 1)

  // Calculate total payment and interest
  const totalPayment = monthlyPayment * term
  const totalInterest = totalPayment - amount

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Loan application submitted",
        description: "Your loan application has been submitted successfully.",
      })

      setSuccess(true)

      // Redirect after successful application
      setTimeout(() => {
        router.push("/loans")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "Failed to submit loan application")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6 text-[#002147]">Apply for a Loan</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Loan Application</CardTitle>
              <CardDescription>Fill out the form to apply for a loan</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>Loan application submitted successfully! Redirecting...</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger id="loanType">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="education">Education Loan</SelectItem>
                      <SelectItem value="emergency">Emergency Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Loan Amount (UGX)</Label>
                  <div className="space-y-2">
                    <Slider
                      id="amount"
                      min={500000}
                      max={10000000}
                      step={100000}
                      value={[amount]}
                      onValueChange={(value) => setAmount(value[0])}
                    />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">500,000</span>
                      <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                      <span className="text-sm text-gray-500">10,000,000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term">Loan Term (Months)</Label>
                  <Select value={term.toString()} onValueChange={(value) => setTerm(Number.parseInt(value))}>
                    <SelectTrigger id="term">
                      <SelectValue placeholder="Select loan term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="18">18 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Loan Purpose</Label>
                  <Textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Briefly describe the purpose of this loan"
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#002147]" disabled={isLoading || success}>
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Loan Summary</CardTitle>
              <CardDescription>Review your loan details before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Loan Type</p>
                <p className="text-lg font-semibold">
                  {loanType === "personal"
                    ? "Personal Loan"
                    : loanType === "education"
                      ? "Education Loan"
                      : "Emergency Loan"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(amount)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Loan Term</p>
                <p className="text-lg font-semibold">{term} months</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                <p className="text-lg font-semibold">{interestRate}% per annum</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Monthly Payment</p>
                <p className="text-lg font-semibold">{formatCurrency(monthlyPayment)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Interest</p>
                <p className="text-lg font-semibold">{formatCurrency(totalInterest)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Repayment</p>
                <p className="text-lg font-semibold">{formatCurrency(totalPayment)}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Note: All loan applications are subject to approval. The actual loan terms may vary based on your
                  account history and SACCO policies.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
