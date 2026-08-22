import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  // Only protect /computer and its sub-routes
  if (!request.nextUrl.pathname.startsWith('/computer')) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // If no refresh token exists at all, redirect to login
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If access token exists, verify it
  if (accessToken) {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not set. Define it in .env.local');
      }
      const secretKey = new TextEncoder().encode(secret);
      await jwtVerify(accessToken, secretKey);
      return NextResponse.next();
    } catch {
      // Access token is invalid or expired.
      // We still have a refresh token, so we let the request through, 
      // but the AuthProvider context will handle refreshing it on the client side,
      // or we can refresh it right here.
      // For simplicity in edge middleware, we'll let the client handle refresh.
    }
  }

  // If we reach here, access token is missing or expired, but refresh token exists.
  // The AuthProvider will intercept 401s and refresh, but we can also just let the 
  // page load, and the AuthProvider's initial check will do the refresh.
  return NextResponse.next();
}

export const config = {
  matcher: ['/computer/:path*'],
};
