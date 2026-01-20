"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { MessageCircle } from "lucide-react";

export function EmbeddedChat() {
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
            text: "Hi there! I'm the AI assistant for this website. Feel free to ask me anything about the person behind this site - their experience, skills, projects, or anything else you'd like to know!",
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
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage({ text: message });
  };

  return (
    <section className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2">
          Chat with me
        </h2>
        <p className="text-sm text-muted-foreground">
          Powered by AI - ask anything about my background
        </p>
      </div>

      <Card className="h-[450px] flex flex-col shadow-soft border-border/50 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b bg-muted/30">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Digital Me</span>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full ml-auto" />
        </div>

        <ScrollArea className="flex-1 p-5" ref={scrollRef}>
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
          </div>
        </ScrollArea>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Ask me anything..."
        />
      </Card>
    </section>
  );
}
