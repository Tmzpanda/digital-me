"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export function SidebarChat() {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hey! 👋 I'm Tim. Ask me anything - about my work, tech opinions, or career advice!",
          },
        ],
      },
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage({ text: message });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header - fixed */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/30">
        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-sm font-semibold text-foreground">Tim</span>
        <span className="text-xs text-muted-foreground/60 ml-auto">AI-powered</span>
      </div>

      {/* Messages - scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 min-h-0"
      >
        <div className="space-y-1">
          {messages.map((message, index) => {
            const textContent = message.parts
              .filter(
                (part): part is { type: "text"; text: string } =>
                  part.type === "text"
              )
              .map((part) => part.text)
              .join("");

            return (
              <ChatBubble
                key={message.id}
                content={textContent}
                role={message.role as "user" | "assistant"}
                isStreaming={
                  isLoading &&
                  index === messages.length - 1 &&
                  message.role === "assistant"
                }
              />
            );
          })}
          {/* Typing indicator - shows when waiting for AI response */}
          {status === "submitted" && (
            <div className="flex gap-3 mb-3">
              <div className="bg-muted/70 rounded-2xl rounded-bl-sm px-4 py-3 border border-border/30 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input - fixed at bottom */}
      <div className="flex-shrink-0">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Ask me anything..."
        />
      </div>
    </div>
  );
}
