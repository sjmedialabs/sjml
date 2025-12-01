import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow access to login page and API routes
  if (pathname === '/admin/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    // Check for token in cookies (set by login API)
    const token = request.cookies.get('admin_token')?.value
    
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Token exists, allow access
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
}
