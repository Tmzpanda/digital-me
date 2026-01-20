"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } =
    useChat({
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
              text: "Hi there! I'm the AI assistant for this personal website. Feel free to ask me anything about the person behind this site - their experience, skills, projects, or anything else you'd like to know!",
            },
          ],
        },
      ],
    });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage({ text: message });
  };

  return (
    <>
      {/* Floating toggle button */}
      <Button
        onClick={toggleChat}
        size="lg"
        className={cn(
          "fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 transition-transform hover:scale-105",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="sr-only">Open chat</span>
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed bottom-6 right-6 w-[380px] shadow-2xl z-50 flex flex-col transition-all duration-200",
            "max-h-[600px]",
            "max-sm:w-[calc(100vw-24px)] max-sm:right-3 max-sm:bottom-3 max-sm:max-h-[80vh]",
            isMinimized ? "h-14" : "h-[500px] max-sm:h-[70vh]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/30 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-sm">Digital Me</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={toggleMinimize}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
                <span className="sr-only">
                  {isMinimized ? "Maximize" : "Minimize"}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={toggleChat}
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Close chat</span>
              </Button>
            </div>
          </div>

          {/* Chat content (hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Messages area */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-1">
                  {messages.map((message, index) => {
                    // Extract text content from message parts
                    const textContent = message.parts
                      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
                      .map(part => part.text)
                      .join('');

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

              {/* Input area */}
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </>
          )}
        </Card>
      )}
    </>
  );
}
