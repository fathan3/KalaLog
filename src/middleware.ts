import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // NextAuth v5 (Auth.js) session cookies
  const hasSession = 
    request.cookies.has('authjs.session-token') || 
    request.cookies.has('__Secure-authjs.session-token') ||
    request.cookies.has('next-auth.session-token') || 
    request.cookies.has('__Secure-next-auth.session-token')

  const { pathname } = request.nextUrl

  // Redirect to login if accessing home without session
  if (pathname === '/') {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect to home if accessing auth pages with session
  if (pathname === '/login' || pathname === '/register') {
    if (hasSession) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/register'],
}
