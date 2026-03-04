import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { agentPersonalities, agents } from "@/data/agents";
import { getMessages, appendMessage } from "@/lib/kv";

export const maxDuration = 30;

interface UIMessagePart {
  type: string;
  text?: string;
}

interface UIMessage {
  role: string;
  parts?: UIMessagePart[];
  content?: string;
}

export async function POST(req: Request) {
  const { messages, agentId } = await req.json();

  const agent = agents.find((a) => a.id === agentId);
  const personality = agentPersonalities[agentId];
  if (!agent || !personality) {
    return new Response(JSON.stringify({ error: "Unknown agent" }), {
      status: 400,
    });
  }

  // Load full history from KV for context continuity
  const history = await getMessages(agentId);

  // Convert UI messages to the format streamText expects
  const currentMessages = messages.map((msg: UIMessage) => {
    let content = msg.content;
    if (msg.parts && Array.isArray(msg.parts)) {
      content = msg.parts
        .filter((part: UIMessagePart) => part.type === "text")
        .map((part: UIMessagePart) => part.text)
        .join("");
    }
    return { role: msg.role, content: content || "" };
  });

  // Get the latest user message to persist
  const lastUserMsg = currentMessages[currentMessages.length - 1];

  // Persist user message
  if (lastUserMsg?.role === "user") {
    await appendMessage(agentId, {
      role: "user",
      content: lastUserMsg.content,
      timestamp: Date.now(),
    });
  }

  // Build full message context: stored history + current messages
  const historyMessages = history.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Use history for context but current messages for the actual conversation
  // (avoids duplicates since current messages include the latest exchange)
  const allMessages =
    historyMessages.length > 0
      ? [...historyMessages.slice(0, -1), ...currentMessages]
      : currentMessages;

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: personality.systemPrompt,
    messages: allMessages,
    onFinish: async ({ text }) => {
      // Persist assistant response
      await appendMessage(agentId, {
        role: "assistant",
        content: text,
        timestamp: Date.now(),
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
