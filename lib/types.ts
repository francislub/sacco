export type Role = "ADMIN" | "USER"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  accountId: string
}

export interface Account {
  id: string
  accountNumber: string
  balance: number
  userId: string
  createdAt: Date
}

export interface Transaction {
  id: string
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER"
  amount: number
  accountId: string
  description: string
  createdAt: Date
}

