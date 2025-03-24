import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Check if the user is authenticated
  const isAuthenticated = !!token

  // Get the path
  const path = request.nextUrl.pathname

  // Verification page should be accessible without authentication
  if (path === "/verify") {
    return NextResponse.next()
  }

  // Admin routes
  if (path.startsWith("/admin")) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If not an admin, redirect to dashboard
    if (token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  }

  // User dashboard routes
  if (path.startsWith("/dashboard")) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  }

  // Auth routes (login, register)
  if (path === "/login" || path === "/register") {
    // If authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (token?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register", "/verify"],
}

