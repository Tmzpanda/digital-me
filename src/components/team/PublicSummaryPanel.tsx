"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, Lock } from "lucide-react";
import { agents as allAgents, dmConversations } from "@/data/agents";
import type { Agent, DmMessage } from "@/data/agents";

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

function DemoMessage({ msg, agent }: { msg: DmMessage; agent: Agent }) {
  const isUser = msg.from === "user";
  const userAgent = allAgents.find((a) => a.id === "1")!;
  const sender = isUser ? userAgent : agent;

  return (
    <div className="flex gap-3 px-5 py-2 hover:bg-secondary/20 transition-colors">
      <div className="shrink-0 mt-0.5 w-[34px] h-[34px]">
        <Avatar agent={sender} size={34} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[13px] text-foreground">
            {sender.name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {msg.timestamp}
          </span>
        </div>
        <p className="text-[13px] text-foreground/80 leading-relaxed">
          {msg.text}
        </p>
      </div>
    </div>
  );
}

interface PublicSummaryPanelProps {
  agent: Agent;
  onBack: () => void;
  onLoginClick: () => void;
}

export function PublicSummaryPanel({
  agent,
  onBack,
  onLoginClick,
}: PublicSummaryPanelProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingSummary(true);

    async function loadSummary() {
      try {
        const res = await fetch(
          `/api/agents/summary?agentId=${agent.id}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setSummary(data.summary);
      } catch {
        // Fall through to demo conversations
      } finally {
        if (!cancelled) setLoadingSummary(false);
      }
    }

    loadSummary();
    return () => {
      cancelled = true;
    };
  }, [agent.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [agent.id, summary]);

  const demoMessages = dmConversations[agent.id] ?? [];

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
        <div className="min-w-0">
          <span className="font-semibold text-foreground text-[15px]">
            {agent.name}
          </span>
          <p className="text-[12px] text-muted-foreground">{agent.role}</p>
        </div>
        <span
          className={`ml-auto text-[11px] px-2 py-0.5 rounded-full ${
            agent.status === "online"
              ? "bg-green-500/10 text-green-600"
              : "bg-yellow-500/10 text-yellow-600"
          }`}
        >
          {agent.status === "online" ? "Online" : "Away"}
        </span>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 min-h-0">
        {loadingSummary ? (
          <div className="flex items-center justify-center h-full text-muted-foreground/40 text-sm">
            Loading...
          </div>
        ) : summary ? (
          /* AI-generated summary */
          <div className="px-5 py-4">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Collaboration Summary
            </div>
            <div className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        ) : demoMessages.length > 0 ? (
          /* Demo conversation fallback */
          demoMessages.map((msg, i) => (
            <DemoMessage key={i} msg={msg} agent={agent} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground/40 text-sm">
            No messages yet
          </div>
        )}
      </div>

      {/* Sign-in prompt */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        <button
          onClick={onLoginClick}
          className="flex items-center justify-center gap-2 w-full bg-secondary/30 border border-border rounded-lg px-4 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          <Lock className="w-3.5 h-3.5" />
          Sign in to message {agent.name}
        </button>
      </div>
    </div>
  );
}
