import { SignJWT, jwtVerify } from "jose";
import { env } from "@repo/env";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

export interface SessionPayload {
  userId: string;
  sessionId: string;
}

export async function signAccessToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // 15 minutes access token
    .sign(secretKey);
}

export async function verifyAccessToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
