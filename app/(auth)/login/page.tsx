"use client"

import type React from "react"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { data: sessionData, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerificationField, setShowVerificationField] = useState(false)
  const [userId, setUserId] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting sign in with:", {
        email,
        password,
        verificationCode: showVerificationField ? verificationCode : undefined,
      })

      const result = await signIn("credentials", {
        email,
        password,
        verificationCode: showVerificationField ? verificationCode : undefined,
        redirect: false,
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        if (result.error === "CredentialsSignin" && !showVerificationField) {
          // Check if this is a 2FA request
          console.log("Checking for 2FA requirement...")

          try {
            const response = await fetch("/api/auth/session")
            console.log("Session response status:", response.status)

            const session = await response.json()
            console.log("Session data:", session)

            if (session?.requires2FA) {
              console.log("2FA required, showing verification field")
              setShowVerificationField(true)
              setUserId(session.user.id)
              setError("Please enter the verification code sent to your email")
            } else {
              console.log("Invalid credentials, no 2FA required")
              setError("Invalid email or password")
            }
          } catch (sessionError) {
            console.error("Error fetching session:", sessionError)
            setError("Failed to check authentication status")
          }
        } else {
          setError(result.error === "CredentialsSignin" ? "Invalid verification code" : result.error)
        }
      } else {
        // Check if user is admin to redirect to the correct dashboard
        console.log("Authentication successful, redirecting...")

        try {
          const response = await fetch("/api/auth/session")
          const session = await response.json()
          console.log("Final session data for redirect:", session)

          if (session?.user?.role === "ADMIN") {
            router.push("/admin/dashboard")
          } else {
            router.push("/dashboard")
          }
          router.refresh()
        } catch (redirectError) {
          console.error("Error during redirect:", redirectError)
          // Default redirect if we can't determine role
          router.push("/dashboard")
          router.refresh()
        }
      }
    } catch (error) {
      console.error("Unexpected login error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerificationCode = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    try {
      console.log("Resending verification code to:", email)
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          type: "LOGIN",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to resend verification code")
      }

      setError("Verification code has been resent to your email")
    } catch (error: any) {
      setError(error.message || "Failed to resend verification code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login to BUESACCO</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert
              variant={error.includes("verification code has been resent") ? "default" : "destructive"}
              className="mb-4"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={showVerificationField}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={showVerificationField}
              />
            </div>

            {showVerificationField && (
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <div className="relative">
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    placeholder="Enter 6-digit code"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={resendVerificationCode}
                    disabled={isLoading}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Resend
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  A verification code has been sent to your email. It will expire in 10 minutes.
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : showVerificationField ? "Verify & Sign In" : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

