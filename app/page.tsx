import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, User } from "lucide-react"

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

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Login
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Member Registration</h2>
            <p className="text-gray-600 mb-4">
              Join as a regular member to save, access loans, and manage your finances.
            </p>
            <Link href="/register?role=user">
              <Button className="w-full" variant="outline">
                Register as Member
              </Button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Admin Registration</h2>
            <p className="text-gray-600 mb-4">
              Register as an administrator to manage members, accounts, and SACCO operations.
            </p>
            <Link href="/register?role=admin">
              <Button className="w-full" variant="outline">
                Register as Admin
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-slate-500">
          <p>A secure platform for managing your savings and accessing credit facilities</p>
        </div>
      </div>
    </div>
  )
}

