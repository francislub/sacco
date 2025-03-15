"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { Account } from "@prisma/client"
import { formatCurrency } from "@/lib/utils"

interface TransferFormProps {
  account: Account
  otherAccounts: (Account & { user: { name: string } })[]
}

export function TransferForm({ account, otherAccounts }: TransferFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [recipientId, setRecipientId] = useState("")

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

      if (!recipientId) {
        throw new Error("Please select a recipient")
      }

      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountValue,
          description,
          fromAccountId: account.id,
          toAccountId: recipientId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to process transfer")
      }

      toast({
        title: "Transfer successful",
        description: `${formatCurrency(amountValue)} has been transferred successfully.`,
      })

      // Refresh the page data
      router.refresh()

      // Reset form
      setAmount("")
      setDescription("")
      setRecipientId("")
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "Failed to process transfer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient</Label>
        <Select value={recipientId} onValueChange={setRecipientId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select recipient" />
          </SelectTrigger>
          <SelectContent>
            {otherAccounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.user.name} ({account.accountNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
          placeholder="Enter a description for this transfer"
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : "Transfer Funds"}
      </Button>
    </form>
  )
}

