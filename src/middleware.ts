import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token'); // Assuming your token is stored in a cookie named 'auth-token'
  const url = request.nextUrl;

  // Redirect authenticated users to the dashboard if they try to access sign-in, sign-up, verify, or home
  if (token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/verify') || url.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url)); // Redirect to /dashboard if logged in
  }

  // Redirect unauthenticated users to the home page if they try to access protected routes (e.g., /dashboard)
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/home', request.url)); // Redirect to /home if not logged in
  }

  // Allow other requests to continue
  return NextResponse.next();
}
