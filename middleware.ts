import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map(({ name, value }) => ({ name, value }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 1. DASHBOARD PROTECTION (Auth Only)
  if (req.nextUrl.pathname.startsWith('/Dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/Login', req.url))
    }
  }

  // 2. ADMIN PROTECTION (Auth + Role)
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Exempt the login page itself
    if (req.nextUrl.pathname === '/admin/login') {
      return res
    }

    if (!session) {
      return NextResponse.redirect(new URL('/auth/Login', req.url))
    }

    // Server-side role check
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (error || !profile?.is_admin) {
      console.warn(`Unauthorized admin access attempt by ${session.user.email}`)
      return NextResponse.redirect(new URL('/Dashboard/Live', req.url))
    }
  }

  // 3. AUTH PAGE REDIRECTION
  if (req.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      return NextResponse.redirect(new URL('/Dashboard/Live', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/Dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
