import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/* ------------- public (always‑allowed) routes ----------------------- */
const PUBLIC_ROUTES = [
  "/",
  '/login',
  '/signup',
  '/favicon.ico',
  '/_next',            // static assets / chunks
];

/* ------------- patterns for role‑specific sections ------------------ */
const CUSTOMER_ONLY = [
  '/customer',         // dashboard root
  '/orders',           // order placement + order list
  '/tracking',         // tracking page
];

const DELIVERY_ONLY = [
  '/partner',          // delivery partner dashboard
  '/delivery-history', // delivery order history
];

const ADMIN_ONLY = [
  '/admin',            // admin dashboard
  '/admin-panel',      // admin specific pages
];

/* ------------ helper: check if pathname starts with any prefix ------ */
const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname.startsWith(p));

/* ------------ read JWT from cookie (or header fallback) ------------- */
function getToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  if (header?.startsWith('Bearer ')) return header.split(' ')[1];
  return req.cookies.get('token')?.value ?? null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ----------------- allow public assets & routes ------------------- */
  if (matches(pathname, PUBLIC_ROUTES)) return NextResponse.next();

  /* ----------------- verify token ------------------------------------ */
  const token = getToken(req);
  if (!token || !process.env.JWT_SECRET) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  let role: 'CUSTOMER' | 'DELIVERY' | 'ADMIN';
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      role: 'CUSTOMER' | 'DELIVERY' | 'ADMIN';
    };
    role = decoded.role;
  } catch {
    // invalid / expired token → force re‑login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  /* ----------------- role‑based access check ------------------------- */
  if (role === 'CUSTOMER') {
    if (matches(pathname, DELIVERY_ONLY) || matches(pathname, ADMIN_ONLY)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  if (role === 'DELIVERY') {
    if (matches(pathname, CUSTOMER_ONLY) || matches(pathname, ADMIN_ONLY)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  if (role === 'ADMIN') {
    if (matches(pathname, CUSTOMER_ONLY) || matches(pathname, DELIVERY_ONLY)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    // (Optional) You can even limit Admin to only `/admin` paths, if needed.
  }

  // otherwise → allow
  return NextResponse.next();
}

/* ------------- tell Next.js which paths should invoke middleware ---- */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
