import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register" || path === "/"

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect logic
  if (isPublicPath && token) {
    // If user is already logged in and tries to access login/register page
    // Redirect to appropriate dashboard based on role
    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected route
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Role-based access control
  if (token && path.startsWith("/admin") && token.role !== "ADMIN") {
    // If non-admin user tries to access admin routes
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

