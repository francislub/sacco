import type React from "react"
import { UserSidebar } from "@/components/layout/user-sidebar"
import { UserHeader } from "@/components/layout/user-header"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // If user is admin, redirect to admin dashboard
  if ((session.user as any).role === "ADMIN") {
    redirect("/admin/dashboard")
  }

  return (
    <div className="flex h-screen">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <UserHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

