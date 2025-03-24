"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Mail, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const userId = searchParams.get("userId")
  const email = searchParams.get("email")
  const type = searchParams.get("type") || "REGISTRATION"

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [code, setCode] = useState("")

  useEffect(() => {
    if (!userId || !email) {
      router.push("/login")
    }
  }, [userId, email, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // First, verify the code
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          code,
          type,
        }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "Verification failed")
      }

      // If verification successful, complete the authentication
      if (type === "LOGIN") {
        const completeResponse = await fetch("/api/auth/verify-complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            email,
          }),
        })

        const completeData = await completeResponse.json()

        if (!completeResponse.ok) {
          throw new Error(completeData.error || "Authentication failed")
        }

        setSuccess(true)

        // Redirect to the appropriate dashboard
        setTimeout(() => {
          if (completeData.role === "ADMIN") {
            router.push("/admin/dashboard")
          } else {
            router.push("/dashboard")
          }
        }, 1500)
      } else {
        // For registration or other types
        setSuccess(true)

        // Redirect after successful verification
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      }
    } catch (error: any) {
      setError(error.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerificationCode = async () => {
    if (!email) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          type,
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

  if (!userId || !email) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {type === "LOGIN" ? "Login Verification" : "Verify Your Account"}
          </CardTitle>
          <CardDescription>Enter the verification code sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant={error.includes("resent") ? "default" : "destructive"} className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                {type === "LOGIN"
                  ? "Verification successful! Redirecting to dashboard..."
                  : "Verification successful! Redirecting to login..."}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <div className="relative">
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  maxLength={6}
                  disabled={isLoading || success}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={resendVerificationCode}
                  disabled={isLoading || success}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-1" />
                      Resend
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                A verification code has been sent to your email. It will expire in 10 minutes.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || success}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            {type === "LOGIN" ? (
              <>
                Need to use a different account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Back to login
                </a>
              </>
            ) : (
              <>
                Already verified?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </a>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

