import { kv } from "@vercel/kv";

export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export async function getMessages(agentId: string): Promise<StoredMessage[]> {
  const messages = await kv.get<StoredMessage[]>(`chat:${agentId}`);
  return messages ?? [];
}

export async function appendMessage(
  agentId: string,
  msg: StoredMessage
): Promise<void> {
  const messages = await getMessages(agentId);
  messages.push(msg);
  await kv.set(`chat:${agentId}`, messages);
}

export async function getSummary(agentId: string): Promise<string | null> {
  return kv.get<string>(`summary:${agentId}`);
}

export async function setSummary(
  agentId: string,
  summary: string
): Promise<void> {
  await kv.set(`summary:${agentId}`, summary);
}
