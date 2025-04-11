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
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ // Create new response to attach cookie
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
           response = NextResponse.next({ // Create new response to attach cookie
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - important for Server Components
  // await supabase.auth.getUser() // Deprecated, use getSession instead if needed here, but usually handled by accessing user below

  // Optional: Check if user is logged in (can be used for route protection)
   const { data: { user } } = await supabase.auth.getUser();

  // Example: Redirect to login if trying to access protected route and not logged in
  // Adjust '/pdf-reader' to your protected route path
  // if (!user && request.nextUrl.pathname.startsWith('/pdf-reader')) {
  //    const loginUrl = new URL('/login', request.url)
  //    loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname) // Optional: pass redirect path
  //    return NextResponse.redirect(loginUrl);
  // }


  return response
} 