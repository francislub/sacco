"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(500000)
  const [loanTerm, setLoanTerm] = useState(12)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  // Interest rate is fixed at 15% per annum
  const interestRate = 15

  useEffect(() => {
    // Calculate monthly payment
    const monthlyInterestRate = interestRate / 100 / 12
    const monthlyPaymentValue =
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)

    // Calculate total payment and interest
    const totalPaymentValue = monthlyPaymentValue * loanTerm
    const totalInterestValue = totalPaymentValue - loanAmount

    setMonthlyPayment(monthlyPaymentValue)
    setTotalPayment(totalPaymentValue)
    setTotalInterest(totalInterestValue)
  }, [loanAmount, loanTerm])

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[#002147]">Loan Calculator</h3>
      <p className="text-gray-600 mb-6">
        Estimate your monthly loan repayments with our calculator. Adjust the amount and term to see different
        scenarios.
      </p>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Loan Amount: {formatCurrency(loanAmount)}</label>
          </div>
          <Slider
            value={[loanAmount]}
            min={100000}
            max={10000000}
            step={100000}
            onValueChange={(value) => setLoanAmount(value[0])}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>UGX 100,000</span>
            <span>UGX 10,000,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Loan Term: {loanTerm} months</label>
          </div>
          <Slider value={[loanTerm]} min={3} max={60} step={3} onValueChange={(value) => setLoanTerm(value[0])} />
          <div className="flex justify-between text-xs text-gray-500">
            <span>3 months</span>
            <span>60 months</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Monthly Payment:</span>
            <span className="font-semibold">{formatCurrency(monthlyPayment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Total Interest:</span>
            <span className="font-semibold">{formatCurrency(totalInterest)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Total Repayment:</span>
            <span className="font-semibold">{formatCurrency(totalPayment)}</span>
          </div>
        </div>

        <Button className="w-full bg-[#002147]">Calculate</Button>
      </div>
    </div>
  )
}
