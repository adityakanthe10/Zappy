// middleware.ts (root of your Next.js app)
import {  NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/* ------------- public (always‑allowed) routes ----------------------- */
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/api',              // all API routes stay accessible (adjust if needed)
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

/* ------------ helper: check if pathname starts with any prefix ------ */
const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname.startsWith(p));

/* ------------ read JWT from header or cookie ------------------------ */
function getToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  if (header?.startsWith('Bearer ')) return header.split(' ')[1];
  return req.cookies.get('token')?.value ?? null; // if you later move token to cookie
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ----------------- allow public assets & routes ------------------- */
  if (matches(pathname, PUBLIC_ROUTES)) return NextResponse.next();

  /* ----------------- verify token ----------------------------------- */
  const token = getToken(req);
  if (!token || !process.env.JWT_SECRET) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  let role: 'CUSTOMER' | 'DELIVERY';
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      role: 'CUSTOMER' | 'DELIVERY';
    };
    role = decoded.role;
  } catch {
    // invalid / expired token → force re‑login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  /* ----------------- role‑based access check ------------------------ */
  if (role === 'CUSTOMER' && matches(pathname, DELIVERY_ONLY)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (role === 'DELIVERY' && matches(pathname, CUSTOMER_ONLY)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // otherwise everything’s fine →
  return NextResponse.next();
}

/* ------------- tell Next.js which paths should invoke middleware ---- */
export const config = {
  matcher: [
    /*
      Match everything except:
      - public files (/_next, /favicon.ico)
      - static images or fonts
      If you want stricter control you can list explicit folders.
    */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
