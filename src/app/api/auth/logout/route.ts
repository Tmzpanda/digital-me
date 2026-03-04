import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getClearCookieConfig } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(getClearCookieConfig());
  return NextResponse.json({ ok: true });
}
