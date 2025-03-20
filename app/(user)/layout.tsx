import type React from "react"
import { UserSidebar } from "@/components/layout/user-sidebar"
import { UserHeader } from "@/components/layout/user-header"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"

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
  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <UserSidebar />
        <SidebarInset>
          <div className="flex-1 flex flex-col">
            <div className="border-b bg-white">
              <div className="flex h-14 items-center justify-between px-6">
                <div className="flex items-center">
                  <SidebarTrigger className="mr-2 md:hidden" />
                  <h2 className="text-lg font-semibold">Bugema University Employee Sacco</h2>
                </div>
                <UserHeader />
              </div>
            </div>
            <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

