// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname === '/dashboard') {
    // Read the `uid` cookie
    const uid = req.cookies.get('uid')?.value;

    if (uid) {
        console.log(uid)
        // Rewrite the URL to `/dashboard/[uid]`
        return NextResponse.rewrite(new URL(`/Dashboard/${uid}`, req.url));
    } else {
        // Redirect to auth page if the user is not authenticated
        return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  return NextResponse.next();
}