import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { agents } from "@/data/agents";
import { getMessages, setSummary } from "@/lib/kv";

export async function POST(req: NextRequest) {
  const { agentId } = await req.json();

  const agent = agents.find((a) => a.id === agentId);
  if (!agent) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 400 });
  }

  const messages = await getMessages(agentId);
  if (messages.length === 0) {
    return NextResponse.json(
      { error: "No chat history to summarize" },
      { status: 400 }
    );
  }

  const chatTranscript = messages
    .map(
      (m) =>
        `${m.role === "user" ? "Tim" : agent.name}: ${m.content}`
    )
    .join("\n\n");

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-20250514"),
    prompt: `You are generating a professional public-facing summary of a collaboration between Tim (a Data Engineer at Meta) and ${agent.name} (${agent.role}).

Based on the chat history below, write a concise summary (3-5 paragraphs) that:
- Highlights the key topics discussed and work accomplished
- Shows the productive working relationship
- Is appropriate for a portfolio/personal website (no private details, passwords, or sensitive information)
- Reads naturally as a description of ongoing collaboration
- Uses present tense where appropriate

Chat history:
${chatTranscript}

Write the summary now:`,
  });

  await setSummary(agentId, text);

  return NextResponse.json({ summary: text });
}
