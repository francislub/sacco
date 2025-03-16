"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, X } from "lucide-react"

export function TransactionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [type, setType] = useState(searchParams.get("type") || "")
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (type) params.set("type", type)
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    setType("")
    setStartDate("")
    setEndDate("")
    router.push("")
  }

  const hasFilters = type || startDate || endDate

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Label htmlFor="type">Transaction Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="DEPOSIT">Deposit</SelectItem>
                <SelectItem value="WITHDRAW">Withdraw</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="w-full md:w-1/3">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
          <Button onClick={applyFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

