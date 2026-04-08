// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Public paths
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.includes(pathname);

  // Admin paths
  const isAdminPath = pathname.startsWith('/admin');

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublicPath && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check admin role
  if (isAdminPath && token) {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/investments/:path*',
    '/tasks/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};