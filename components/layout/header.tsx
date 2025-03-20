import { UserButton } from "@/components/user-button"

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <h2 className="text-lg font-semibold">Bugema University Employee Sacco </h2>
      <UserButton />
    </header>
  )
}

