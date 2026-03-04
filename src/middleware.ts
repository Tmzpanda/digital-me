import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/api/agents/chat",
  "/api/agents/history",
  "/api/agents/summary/generate",
];

async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) return false;

  // Use Web Crypto API (Edge-compatible)
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison
  if (signature.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("session_token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/agents/:path*"],
};
