"use client";

import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

export function ChatBubble({ content, role, isStreaming }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 mb-3 transition-opacity duration-200",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted/70 text-foreground rounded-bl-sm border border-border/30"
        )}
      >
        <p className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-1 h-4 ml-1 bg-primary/60 animate-pulse rounded-full" />
          )}
        </p>
      </div>
    </div>
  );
}
