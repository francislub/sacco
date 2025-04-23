"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't show header and footer on dashboard routes
  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/users") || pathname.startsWith("/admin/accounts") || pathname.startsWith("/admin/loans") || pathname.startsWith("/admin/transactions") || pathname.startsWith("/admin/deposits") || pathname.startsWith("/admin/withdrawals") || pathname.startsWith("/admin/transfers") || pathname.startsWith("/admin/announcements") || pathname.startsWith("/admin/settings") || pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/register-admin") || pathname.startsWith("/transactions") || pathname.startsWith("/deposit") || pathname.startsWith("/withdraw") || pathname.startsWith("/transfer") || pathname.startsWith("/loans") || pathname.startsWith("/profile") || pathname === "/verify"

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboardRoute && <Header />}
      <div className="flex-grow">{children}</div>
      {!isDashboardRoute && <Footer />}
    </div>
  )
}
