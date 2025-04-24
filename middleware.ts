import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Check if the path is protected
    const isProtectedPath =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/deposit") ||
      pathname.startsWith("/withdraw") ||
      pathname.startsWith("/transfer") ||
      pathname.startsWith("/loans") ||
      pathname.startsWith("/transactions")

    // Check if the path is admin-only
    const isAdminPath = pathname.startsWith("/admin")

    // Check if the path is auth-related
    const isAuthPath = pathname === "/login" || pathname === "/register" || pathname === "/verify"

    // Get the token with a fallback secret for development
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "1234567890qwertfgjvb",
    })

    // If the user is not logged in and trying to access a protected route
    if (!token && isProtectedPath) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    // If the user is logged in but trying to access auth pages
    if (token && isAuthPath) {
      // Redirect to appropriate dashboard based on role
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // If the user is not an admin but trying to access admin routes
    if (token && isAdminPath && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // If the user needs 2FA verification
    if (token && (token as any).requires2FA && pathname !== "/verify") {
      return NextResponse.redirect(new URL("/verify", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, allow the request to proceed to avoid blocking the application
    return NextResponse.next()
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/deposit/:path*",
    "/withdraw/:path*",
    "/transfer/:path*",
    "/loans/:path*",
    "/transactions/:path*",
    "/login",
    "/register",
    "/verify",
  ],
}
