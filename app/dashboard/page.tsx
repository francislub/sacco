import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  // This would be replaced with real data from your database
  const accountData = {
    accountNumber: "250000",
    balance: 45000.0,
    totalAccounts: 2,
    totalBalance: 84500,
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to Bugema University Employee Sacco</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Number</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountData.accountNumber}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(accountData.balance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountData.totalAccounts}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

