import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SystemSettingsForm } from "@/components/system-settings-form"
import { AdminPasswordForm } from "@/components/admin-password-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const userId = session.user.id

  // Get user data
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemSettingsForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Admin Password</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminPasswordForm userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

