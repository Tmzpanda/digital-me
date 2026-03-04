import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "session_token";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export function verifyPasscode(input: string): boolean {
  const expected = process.env.OWNER_PASSCODE;
  if (!expected) return false;

  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSession(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET not configured");

  const timestamp = Date.now().toString();
  const signature = createHmac("sha256", secret)
    .update(timestamp)
    .digest("hex");

  return `${timestamp}.${signature}`;
}

function verifyToken(token: string): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) return false;

  const expected = createHmac("sha256", secret)
    .update(timestamp)
    .digest("hex");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;

  return timingSafeEqual(sigBuf, expBuf);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function getSessionCookieConfig(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
}

export function getClearCookieConfig() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}
