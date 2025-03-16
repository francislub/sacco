"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Receipt, PiggyBank, ArrowUpRight, ArrowDownLeft, User, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function UserSidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: Receipt },
    { href: "/deposit", label: "Deposit", icon: ArrowDownLeft },
    { href: "/withdraw", label: "Withdraw", icon: ArrowUpRight },
    { href: "/transfer", label: "Transfer", icon: PiggyBank },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-800 text-white">
      <div className="flex items-center p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
          <span className="text-xl font-bold">B</span>
        </div>
        <h1 className="ml-2 text-xl font-bold">BUESACCO</h1>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === link.href ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-blue-700 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-blue-700 hover:text-white"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  )
}

