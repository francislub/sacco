import { UserButton } from "@/components/user-button"

export function AdminHeader() {
  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-600 mr-4">Admin Panel</span>
      <UserButton />
    </div>
  )
}

