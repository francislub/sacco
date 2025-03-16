"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Shield, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [role, setRole] = useState<"ADMIN" | "USER">("USER")

  useEffect(() => {
    if (roleParam === "admin") {
      setRole("ADMIN")
    } else {
      setRole("USER")
    }
  }, [roleParam])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: password,
          role: role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <Badge variant={role === "ADMIN" ? "secondary" : "default"} className="ml-2">
              {role === "ADMIN" ? (
                <>
                  <Shield className="h-3 w-3 mr-1" /> Admin
                </>
              ) : (
                <>
                  <User className="h-3 w-3 mr-1" /> Member
                </>
              )}
            </Badge>
          </div>
          <CardDescription>Register to join Bugema University Employees SACCO</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>Registration successful! Redirecting to login...</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || success}>
              {isLoading ? "Registering..." : `Register as ${role === "ADMIN" ? "Admin" : "Member"}`}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
          <div className="text-xs text-center text-gray-500">
            Want to register as a {role === "ADMIN" ? "member" : "admin"}?{" "}
            <Link
              href={role === "ADMIN" ? "/register?role=user" : "/register?role=admin"}
              className="text-blue-600 hover:underline"
            >
              Click here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

