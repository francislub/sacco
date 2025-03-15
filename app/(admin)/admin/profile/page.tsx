import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { UserProfileForm } from "@/components/user-profile-form"

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const userId = (session.user as any).id

  // Get user data
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      account: true,
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfileForm user={user} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
                <p className="mt-1 text-lg">{user.account?.accountNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Admin Since</h3>
                <p className="mt-1 text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p className="mt-1 text-lg">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

