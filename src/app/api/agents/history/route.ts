import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "@/lib/kv";

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get("agentId");

  if (!agentId) {
    return NextResponse.json(
      { error: "agentId is required" },
      { status: 400 }
    );
  }

  const messages = await getMessages(agentId);
  return NextResponse.json({ messages });
}
