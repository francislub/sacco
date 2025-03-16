"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Account {
  id: string
  accountNumber: string
  balance: number
  user: {
    name: string
  }
}

export function AdminWithdrawForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [accountId, setAccountId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/accounts")

        if (!response.ok) {
          throw new Error("Failed to fetch accounts")
        }

        const data = await response.json()
        setAccounts(data)
      } catch (error) {
        console.error("Error fetching accounts:", error)
        toast({
          title: "Error",
          description: "Failed to load accounts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAccounts(false)
      }
    }

    fetchAccounts()
  }, [])

  useEffect(() => {
    if (accountId) {
      const account = accounts.find((acc) => acc.id === accountId) || null
      setSelectedAccount(account)
    } else {
      setSelectedAccount(null)
    }
  }, [accountId, accounts])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const amountValue = Number.parseFloat(amount)

      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (!accountId) {
        throw new Error("Please select an account")
      }

      if (selectedAccount && amountValue > selectedAccount.balance) {
        throw new Error("Insufficient funds in the account")
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
          accountId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to process withdrawal")
      }

      toast({
        title: "Withdrawal successful",
        description: `${amountValue.toLocaleString()} UGX has been withdrawn.`,
      })

      // Refresh the page data
      router.refresh()

      // Reset form
      setAccountId("")
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
        <Label htmlFor="account">Select Account</Label>
        {isLoadingAccounts ? (
          <div className="text-sm text-gray-500">Loading accounts...</div>
        ) : (
          <Select value={accountId} onValueChange={setAccountId} required>
            <SelectTrigger id="account">
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.user.name} ({account.accountNumber}) - {formatCurrency(account.balance)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {selectedAccount && (
        <div className="text-sm text-blue-600">Available balance: {formatCurrency(selectedAccount.balance)}</div>
      )}
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
          max={selectedAccount?.balance}
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
      <Button type="submit" className="w-full" disabled={isLoading || isLoadingAccounts}>
        {isLoading ? "Processing..." : "Process Withdrawal"}
      </Button>
    </form>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 2,
  }).format(amount)
}

