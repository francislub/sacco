"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { Account } from "@prisma/client"
import { formatCurrency } from "@/lib/utils"

interface WithdrawFormProps {
  account: Account
}

export function WithdrawForm({ account }: WithdrawFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const amountValue = Number.parseFloat(amount)

      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (amountValue > account.balance) {
        throw new Error("Insufficient funds")
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "WITHDRAW",
          amount: amountValue,
          description,
          accountId: account.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to process withdrawal")
      }

      toast({
        title: "Withdrawal successful",
        description: `${formatCurrency(amountValue)} has been withdrawn from your account.`,
      })

      // Refresh the page data
      router.refresh()

      // Reset form
      setAmount("")
      setDescription("")
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "Failed to process withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (UGX)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
          min="1"
          max={account.balance}
          step="0.01"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description for this withdrawal"
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : "Withdraw Funds"}
      </Button>
    </form>
  )
}

