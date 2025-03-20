"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Bell,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Admin sidebar links
const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/accounts", label: "Accounts", icon: CreditCard },
  { href: "/admin/loans", label: "Loans", icon: PiggyBank },
  { href: "/admin/transactions", label: "Transactions", icon: Receipt },
  { href: "/admin/deposits", label: "Deposits", icon: ArrowDownLeft },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpRight },
  { href: "/admin/transfers", label: "Transfers", icon: PiggyBank },
  { href: "/admin/announcements", label: "Announcements", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="w-64 bg-slate-80 text-white">
      <SidebarHeader className="border-b border-slate-700">
        <div className="flex items-center p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
            <span className="text-xl font-bold">B</span>
          </div>
          <h1 className="ml-2 text-xl font-bold">BUESACCO</h1>
        </div>
        <div className="px-4 py-2 text-xs font-semibold uppercase text-gray-400">Admin Panel</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={link.label}
                  className={cn(
                    "text-gray-300 hover:bg-blue-700 hover:text-white",
                    isActive && "bg-blue-600 text-white",
                  )}
                >
                  <Link href={link.href} className="flex items-center">
                    <Icon className="h-5 w-5" />
                    <span className="ml-3">{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: "/" })}
              tooltip="Sign Out"
              className="text-gray-300 hover:bg-blue-700 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail className="hover:bg-slate-700" />
    </Sidebar>
  )
}

