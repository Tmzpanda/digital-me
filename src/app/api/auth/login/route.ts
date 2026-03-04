import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyPasscode,
  createSession,
  getSessionCookieConfig,
} from "@/lib/auth";

export async function POST(req: Request) {
  const { passcode } = await req.json();

  if (!passcode || !verifyPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const token = createSession();
  const cookieConfig = getSessionCookieConfig(token);
  const cookieStore = await cookies();
  cookieStore.set(cookieConfig);

  return NextResponse.json({ ok: true });
}
