import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/' // Default redirect to homepage

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // A simple implementation of cookies for server components.
          // We need this for exchangeCodeForSession to work.
          // Optionally, you can use a more robust implementation using
          // your framework's cookie handling mechanisms.
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // If the cookie is set, update the request cookies.
            request.cookies.set({ name, value, ...options })
            // Create a new response to attach the cookie.
            const response = NextResponse.next({ request })
            response.cookies.set({ name, value, ...options })
            // Ensure the response is returned to set the cookie.
            // This might require adjusting based on your logic flow.
          },
          remove(name: string, options: CookieOptions) {
            // If the cookie is removed, update the request cookies.
            request.cookies.set({ name, value: '', ...options })
            // Create a new response to attach the cookie deletion header.
            const response = NextResponse.next({ request })
            response.cookies.set({ name, value: '', ...options })
            // Ensure the response is returned to clear the cookie.
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      console.log('Successfully exchanged code for session. Redirecting to:', `${origin}${next}`)
      return NextResponse.redirect(`${origin}${next}`)
    }
     console.error('Error exchanging code for session:', error.message)
  } else {
     console.error('No code found in callback URL');
  }

  // return the user to an error page with instructions
   console.error('OAuth callback failed. Redirecting to login with error.')
  return NextResponse.redirect(`${origin}/login?error=OAuth+callback+failed`)
} 