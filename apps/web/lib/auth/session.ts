import { cookies } from "next/headers";
import { prisma } from "@repo/db";
import { signAccessToken, verifyAccessToken, SessionPayload } from "./jwt";
import { env } from "@repo/env/web";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  // 1. Create a session in the database for the refresh token
  // Refresh token expires in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  // 2. Create the access token
  const accessToken = await signAccessToken({
    userId,
    sessionId: session.id,
  });

  // 3. Set cookies
  const cookieStore = await cookies();
  const isProd = env.NODE_ENV === "production";
  
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, session.id, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { accessToken, refreshToken: session.id };
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  return verifyAccessToken(token);
}

export async function clearSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  
  if (refreshToken) {
    // Delete session from database
    try {
      await prisma.session.delete({ where: { id: refreshToken } });
    } catch {
      // Ignore if session already deleted
    }
  }

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
