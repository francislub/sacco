import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewUserForm } from "@/components/new-user-form"

export default function NewUserPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New User</h1>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create User</CardTitle>
            <CardDescription>Add a new user to the SACCO system</CardDescription>
          </CardHeader>
          <CardContent>
            <NewUserForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

