import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/register',
  '/favicon.ico',
  '/_next',
];

// Check if path is public
const isPublic = (pathname: string) =>
  PUBLIC_ROUTES.some((prefix) => pathname.startsWith(prefix));

// Get token from cookie or header
function getToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  if (header?.startsWith('Bearer ')) return header.split(' ')[1];
  return req.cookies.get('token')?.value ?? null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes without auth
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Check token
  const token = getToken(req);
  if (!token || !process.env.JWT_SECRET) {
    console.log('No token or JWT_SECRET missing');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    // ✅ Token valid, allow request
    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Apply middleware to all routes except _next and favicon
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
