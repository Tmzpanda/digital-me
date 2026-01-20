import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { resumeContext } from "@/data/resume-context";
import { linkedinInfo } from "@/data/linkedin-info";
import {
  fetchResumeFromGoogleDoc,
  buildSystemPrompt,
} from "@/lib/fetch-resume";

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
  const { messages } = await req.json();

  // Try to fetch resume from Google Doc, fall back to hardcoded content
  const googleDocResume = await fetchResumeFromGoogleDoc();
  const resumeContent = googleDocResume || resumeContext;
  const systemPrompt = buildSystemPrompt(resumeContent, linkedinInfo);

  // Convert UI messages (with parts) to the format streamText expects
  const convertedMessages = messages.map((msg: UIMessage) => {
    // Extract text content from parts if present
    let content = msg.content;
    if (msg.parts && Array.isArray(msg.parts)) {
      content = msg.parts
        .filter((part: UIMessagePart) => part.type === "text")
        .map((part: UIMessagePart) => part.text)
        .join("");
    }
    return {
      role: msg.role,
      content: content || "",
    };
  });

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages: convertedMessages,
  });

  return result.toUIMessageStreamResponse();
}
