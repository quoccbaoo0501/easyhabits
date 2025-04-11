// lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the request cookies and re-create the response
          // to have the modified cookies attached.
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies and re-create the response
          // to have the modified cookies attached.
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - important!
  const { data: { user } } = await supabase.auth.getUser();

  // Define public and protected routes
  const publicPaths = ['/login', '/auth/callback']; // Add any other public paths like /sign-up
  const pathname = request.nextUrl.pathname;

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // If it's not a public path and the user is not logged in, redirect to login
  if (!isPublicPath && !user) {
    const loginUrl = new URL('/login', request.url);
    // Optional: Add a redirect query param
    // loginUrl.searchParams.set('redirectedFrom', pathname);
    console.log(`Redirecting unauthenticated user from ${pathname} to /login`);
    return NextResponse.redirect(loginUrl);
  }

  // If it's a public path, or the user is logged in, allow the request
  return response
} 