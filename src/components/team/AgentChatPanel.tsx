"use client";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChevronRight, Sparkles } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import type { Agent } from "@/data/agents";
import type { StoredMessage } from "@/lib/kv";

function Avatar({ agent, size = 28 }: { agent: Agent; size?: number }) {
  const hue =
    [...agent.name].reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0) %
    360;
  const initials = agent.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (agent.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={agent.avatar_url}
        alt={agent.name}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center text-white font-semibold"
      style={{
        width: size,
        height: size,
        backgroundColor: `oklch(0.65 0.15 ${hue})`,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
}

interface AgentChatPanelProps {
  agent: Agent;
  onBack: () => void;
}

export function AgentChatPanel({ agent, onBack }: AgentChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/agents/chat",
      body: { agentId: agent.id },
    }),
  });

  // Load chat history from KV on mount
  useEffect(() => {
    let cancelled = false;
    setHistoryLoaded(false);

    async function loadHistory() {
      try {
        const res = await fetch(
          `/api/agents/history?agentId=${agent.id}`
        );
        if (!res.ok) return;
        const { messages: stored } = (await res.json()) as {
          messages: StoredMessage[];
        };

        if (cancelled || stored.length === 0) {
          setHistoryLoaded(true);
          return;
        }

        // Convert stored messages to UI format
        const uiMessages = stored.map((m, i) => ({
          id: `history-${i}`,
          role: m.role as "user" | "assistant",
          parts: [{ type: "text" as const, text: m.content }],
          content: m.content,
          createdAt: new Date(m.timestamp),
        }));

        setMessages(uiMessages);
      } catch {
        // Silently fail - user will just start a fresh chat
      } finally {
        if (!cancelled) setHistoryLoaded(true);
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [agent.id, setMessages]);

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!inputValue.trim() || isLoading) return;

      const message = inputValue.trim();
      setInputValue("");
      await sendMessage({ text: message });
    },
    [inputValue, isLoading, sendMessage]
  );

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      await fetch("/api/agents/summary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id }),
      });
    } catch {
      // Silently fail
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border shrink-0">
        <button
          onClick={onBack}
          className="md:hidden shrink-0 text-muted-foreground hover:text-foreground transition-colors -ml-1"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <Avatar agent={agent} size={32} />
        <div className="min-w-0 flex-1">
          <span className="font-semibold text-foreground text-[15px]">
            {agent.name}
          </span>
          <p className="text-[12px] text-muted-foreground">{agent.role}</p>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={generatingSummary || messages.length === 0}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Generate public summary from chat"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {generatingSummary ? "Generating..." : "Summary"}
        </button>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full ${
            agent.status === "online"
              ? "bg-green-500/10 text-green-600"
              : "bg-yellow-500/10 text-yellow-600"
          }`}
        >
          {agent.status === "online" ? "Online" : "Away"}
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 min-h-0">
        {!historyLoaded ? (
          <div className="flex items-center justify-center h-full text-muted-foreground/40 text-sm">
            Loading...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground/40 text-sm">
            Start a conversation with {agent.name}
          </div>
        ) : (
          <div className="space-y-0">
            {messages.map((message) => {
              const textContent = message.parts
                ?.filter(
                  (part): part is { type: "text"; text: string } =>
                    part.type === "text"
                )
                .map((part) => part.text)
                .join("") || "";

              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className="flex gap-3 px-5 py-2 hover:bg-secondary/20 transition-colors"
                >
                  <div className="shrink-0 mt-0.5 w-[34px] h-[34px]">
                    {isUser ? (
                      <Avatar
                        agent={{
                          id: "1",
                          name: "Tim",
                          role: "",
                          icon: "",
                          avatar_url: "/images/profile.jpg",
                          group: null,
                          status: "away",
                        }}
                        size={34}
                      />
                    ) : (
                      <Avatar agent={agent} size={34} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[13px] text-foreground">
                        {isUser ? "Tim" : agent.name}
                      </span>
                    </div>
                    <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {textContent}
                      {status === "streaming" &&
                        message.id ===
                          messages[messages.length - 1]?.id &&
                        message.role === "assistant" && (
                          <span className="inline-block w-1 h-4 ml-1 bg-primary/60 animate-pulse rounded-full" />
                        )}
                    </p>
                  </div>
                </div>
              );
            })}
            {/* Typing indicator */}
            {status === "submitted" && (
              <div className="flex gap-3 px-5 py-2">
                <div className="shrink-0 mt-0.5 w-[34px] h-[34px]">
                  <Avatar agent={agent} size={34} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[13px] text-foreground">
                      {agent.name}
                    </span>
                  </div>
                  <div className="flex gap-1.5 items-center py-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder={`Message ${agent.name}...`}
        />
      </div>
    </div>
  );
}
