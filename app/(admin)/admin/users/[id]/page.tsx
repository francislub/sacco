"use client"

import { DeleteUserButton } from "@/components/delete-user-button"
import { UserTransactions } from "@/components/user-transactions"
import { db } from "@/lib/db"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Params {
  id: string
}

const getuser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    })

    return user
  } catch (error) {
    return null
  }
}

const AdminUserPage = async ({ params }: { params: Params }) => {
  const userId = params.id
  const user = await getuser(userId)

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.image as string} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email Verified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{format(user.createdAt, "MMM dd, yyyy")}</TableCell>
                <TableCell>{format(user.updatedAt, "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  {user.role === "ADMIN" ? <Badge>Admin</Badge> : <Badge variant="secondary">User</Badge>}
                </TableCell>
                <TableCell>{user.emailVerified ? "Verified" : "Not Verified"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <UserTransactions userId={userId} />
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Deleting this user will permanently remove their account and all associated data. This action cannot be
              undone.
            </p>
            <DeleteUserButton userId={userId} userName={user.name} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminUserPage

