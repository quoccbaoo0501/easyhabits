// middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware' // Adjust path if needed

// By default, clerkMiddleware protects all routes.
// Public routes (like /login) and the sign-in/sign-up pages are typically
// configured via environment variables (NEXT_PUBLIC_CLERK_SIGN_IN_URL, etc.)
// or in your Clerk dashboard settings.
export async function middleware(request: NextRequest) {
  // updateSession handles refreshing the session cookie and protecting routes
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more exceptions.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 