import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@repo/db";
import { signAccessToken } from "../../../../lib/auth/jwt";
import { env } from "@repo/env";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: refreshToken },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
    }

    const accessToken = await signAccessToken({
      userId: session.userId,
      sessionId: session.id,
    });

    const isProd = env.NODE_ENV === "production";
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Refresh token error", error);
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}
