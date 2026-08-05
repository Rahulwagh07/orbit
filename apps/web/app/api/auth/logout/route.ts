import { NextResponse } from "next/server";
import { clearSession } from "../../../../lib/auth/session";
import { env } from "@repo/env";

export async function POST() {
  await clearSession();
  return NextResponse.redirect(new URL("/", env.NEXT_PUBLIC_APP_URL));
}
