import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
            <span className="text-3xl font-bold">B</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4">Bugema University Employee SACCO</h1>
        <p className="text-xl text-slate-600 mb-8">
          Welcome to the Savings and Credit Cooperative Organization for Bugema University Employees
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
              Register
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-slate-500">
          <p>A secure platform for managing your savings and accessing credit facilities</p>
        </div>
      </div>
    </div>
  )
}

