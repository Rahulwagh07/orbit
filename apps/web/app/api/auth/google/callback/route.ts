import { NextResponse } from "next/server";
import { env } from "@repo/env";
import { prisma } from "@repo/db";
import { createSession } from "../../../../../lib/auth/session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", env.NEXT_PUBLIC_APP_URL));
  }

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(new URL("/?error=oauth_not_configured", env.NEXT_PUBLIC_APP_URL));
  }

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error("Token exchange failed", tokenData);
      throw new Error("Failed to exchange token");
    }

    // 2. Fetch user profile
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const profileData = await profileResponse.json();
    if (!profileResponse.ok) {
      console.error("Profile fetch failed", profileData);
      throw new Error("Failed to fetch profile");
    }

    // 3. Upsert user in database
    let user = await prisma.user.findUnique({
      where: { email: profileData.email },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profileData.id,
          name: profileData.name || user.name,
          avatarUrl: profileData.picture || user.avatarUrl,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: profileData.email,
          googleId: profileData.id,
          name: profileData.name,
          avatarUrl: profileData.picture,
        },
      });
      
      // Auto-create default workspace for new user
      await prisma.workspace.create({
        data: {
          name: "Personal Workspace",
          userId: user.id,
        }
      });
    }

    // 4. Create Session
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    await createSession(user.id, ip, userAgent);

    // 5. Redirect to app
    return NextResponse.redirect(new URL("/computer", env.NEXT_PUBLIC_APP_URL));
  } catch (error) {
    console.error("OAuth callback error", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", env.NEXT_PUBLIC_APP_URL));
  }
}
