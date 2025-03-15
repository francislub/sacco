"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Receipt, PiggyBank, ArrowUpRight, ArrowDownLeft, Settings, Bell } from "lucide-react"

interface SidebarProps {
  isAdmin?: boolean
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()

  const userLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: Receipt },
    { href: "/deposit", label: "Deposit", icon: ArrowDownLeft },
    { href: "/withdraw", label: "Withdraw", icon: ArrowUpRight },
    { href: "/transfer", label: "Transfer", icon: PiggyBank },
  ]

  const adminLinks = [
    ...userLinks,
    { href: "/users", label: "Users", icon: Users },
    { href: "/announcements", label: "Announcements", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  const links = isAdmin ? adminLinks : userLinks

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-800 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">BUESACCO</h1>
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
    </div>
  )
}

