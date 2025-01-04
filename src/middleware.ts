import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const url = request.nextUrl;
  if (!token && url.pathname.startsWith('/u')) {
    return NextResponse.next();
  }
  if (token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/verify') || url.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url)); 
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/home', request.url)); 
  }

  return NextResponse.next();
}
