import { UserButton } from "@/components/user-button"

export function AdminHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <h2 className="text-lg font-semibold">Bugema University Employee Sacco - Admin</h2>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Admin Panel</span>
        <UserButton />
      </div>
    </header>
  )
}

