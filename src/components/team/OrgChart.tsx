"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, ChevronDown, X, Send, MessageSquare, Globe, LogOut } from "lucide-react";
import { agents, dmConversations } from "@/data/agents";
import type { Agent, DmMessage } from "@/data/agents";
import { AgentChatPanel } from "./AgentChatPanel";
import { PublicSummaryPanel } from "./PublicSummaryPanel";
import { LoginModal } from "./LoginModal";

/* ------------------------------------------------------------------ */
/*  Avatar                                                             */
/* ------------------------------------------------------------------ */

function Avatar({ agent, size = 28 }: { agent: Agent; size?: number }) {
  const hue =
    [...agent.name].reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0) % 360;
  const initials = agent.name.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);

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
      style={{ width: size, height: size, backgroundColor: `oklch(0.65 0.15 ${hue})`, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

function SidebarSection({
  label,
  children,
  defaultOpen = true,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-3 md:mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-6 md:px-5 py-3 md:py-2 w-full text-left text-[14px] md:text-[13px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? (
          <ChevronDown className="w-4 md:w-3.5 h-4 md:h-3.5 shrink-0" />
        ) : (
          <ChevronRight className="w-4 md:w-3.5 h-4 md:h-3.5 shrink-0" />
        )}
        {label}
      </button>
      {open && <div className="mt-1 md:mt-0.5">{children}</div>}
    </div>
  );
}

function TeamMemberItem({
  agent,
  active,
  onClickName,
  onClickAvatar,
}: {
  agent: Agent;
  active: boolean;
  onClickName: () => void;
  onClickAvatar: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className={`
        group/row flex items-center gap-4 md:gap-3 px-6 md:px-5 py-3 md:py-2 w-full text-[15px] md:text-[14px] transition-colors
        ${active
          ? "bg-secondary text-foreground"
          : "text-foreground/70"
        }
      `}
    >
      {/* Avatar → profile popover */}
      <button
        onClick={onClickAvatar}
        className="group/avatar relative shrink-0 cursor-pointer w-[32px] h-[32px] rounded-full transition-all duration-150 hover:scale-110 hover:shadow-[0_0_0_3px_rgba(128,128,128,0.25)]"
      >
        <Avatar agent={agent} size={32} />
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background md:border-secondary/30 ${
            agent.status === "online" ? "bg-green-500" : "bg-yellow-500"
          }`}
        />
      </button>
      {/* Name → open DM */}
      <button
        onClick={onClickName}
        className="group/name truncate font-medium text-left flex-1 cursor-pointer flex items-center gap-2 md:gap-1.5 hover:text-foreground transition-colors duration-150"
      >
        <span className="truncate group-hover/name:underline underline-offset-2">{agent.name}</span>
        <MessageSquare className="w-4 h-4 md:w-3.5 md:h-3.5 shrink-0 opacity-0 group-hover/name:opacity-50 transition-opacity duration-150" />
      </button>
      <span className="text-[13px] md:text-[12px] text-muted-foreground truncate">{agent.role}</span>
    </div>
  );
}

function TeamSubGroup({
  label,
  agents: groupAgents,
  activeId,
  onSelectDm,
  onClickAvatar,
}: {
  label: string;
  agents: Agent[];
  activeId: string | null;
  onSelectDm: (id: string) => void;
  onClickAvatar: (id: string, e: React.MouseEvent) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-6 md:px-5 py-2.5 md:py-1.5 w-full text-left text-[14px] md:text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? (
          <ChevronDown className="w-3.5 md:w-3 h-3.5 md:h-3 shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 md:w-3 h-3.5 md:h-3 shrink-0" />
        )}
        <span>{label}</span>
      </button>
      {open && (
        <div className="ml-5 md:ml-4">
          {groupAgents.map((agent) => (
            <TeamMemberItem
              key={agent.id}
              agent={agent}
              active={activeId === agent.id}
              onClickName={() => onSelectDm(agent.id)}
              onClickAvatar={(e) => onClickAvatar(agent.id, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  activeId,
  onSelectDm,
  onClickAvatar,
  isAuthed,
  onLoginClick,
  onLogout,
}: {
  activeId: string | null;
  onSelectDm: (id: string) => void;
  onClickAvatar: (id: string, e: React.MouseEvent) => void;
  isAuthed: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="bg-background md:bg-secondary/30 md:border-r md:border-border flex flex-col shrink-0 h-full w-full md:w-[320px] md:min-w-[320px]">
      {/* Team tree */}
      <div className="flex-1 overflow-y-auto py-4 md:py-2">
        <SidebarSection label="Team">
          {agents
            .filter((a) => a.group === null)
            .map((agent) => (
              <TeamMemberItem
                key={agent.id}
                agent={agent}
                active={activeId === agent.id}
                onClickName={() => onSelectDm(agent.id)}
                onClickAvatar={(e) => onClickAvatar(agent.id, e)}
              />
            ))}
          {[
            { key: "Tech", label: "Tech" },
            { key: "Invest", label: "Investment" },
            { key: "Content", label: "Content" },
          ].map((g) => {
            const members = agents.filter((a) => a.group === g.key);
            if (members.length === 0) return null;
            return (
              <TeamSubGroup
                key={g.key}
                label={g.label}
                agents={members}
                activeId={activeId}
                onSelectDm={onSelectDm}
                onClickAvatar={onClickAvatar}
              />
            );
          })}
        </SidebarSection>
      </div>

      {/* Auth footer */}
      <div className="px-5 py-3 border-t border-border shrink-0">
        {isAuthed ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Owner sign in
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat Panel (demo view for public / Tim's own row)                  */
/* ------------------------------------------------------------------ */

function ChatHeader({
  agent,
  onClickProfile,
  onBack,
}: {
  agent: Agent;
  onClickProfile: (e: React.MouseEvent) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-border shrink-0">
      <button
        onClick={onBack}
        className="md:hidden shrink-0 text-muted-foreground hover:text-foreground transition-colors -ml-1 mr--1"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
      </button>
      <button onClick={onClickProfile} className="shrink-0 w-[32px] h-[32px] rounded-full transition-all duration-150 hover:scale-110 hover:shadow-[0_0_0_3px_rgba(128,128,128,0.25)]">
        <Avatar agent={agent} size={32} />
      </button>
      <div className="min-w-0">
        <button onClick={onClickProfile} className="font-semibold text-foreground text-[15px] hover:underline">
          {agent.name}
        </button>
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
  );
}

function ChatMessage({
  msg,
  agent,
  onClickSender,
}: {
  msg: DmMessage;
  agent: Agent;
  onClickSender: (senderId: string, e: React.MouseEvent) => void;
}) {
  const isUser = msg.from === "user";
  const userAgent = agents.find((a) => a.id === "1")!;
  const sender = isUser ? userAgent : agent;

  return (
    <div className="flex gap-3 px-5 py-2 hover:bg-secondary/20 transition-colors">
      <button
        onClick={(e) => onClickSender(sender.id, e)}
        className="shrink-0 mt-0.5 w-[34px] h-[34px] rounded-full transition-all duration-150 hover:scale-110 hover:shadow-[0_0_0_3px_rgba(128,128,128,0.25)] cursor-pointer"
      >
        <Avatar agent={sender} size={34} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[13px] text-foreground">{sender.name}</span>
          <span className="text-[11px] text-muted-foreground">{msg.timestamp}</span>
        </div>
        <p className="text-[13px] text-foreground/80 leading-relaxed">{msg.text}</p>
      </div>
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-muted-foreground/40 space-y-2">
        <p className="text-sm">Select a team member to view conversation</p>
      </div>
    </div>
  );
}

function ChatPanel({
  agent,
  onClickProfile,
  onClickSender,
  onBack,
}: {
  agent: Agent;
  onClickProfile: (e: React.MouseEvent) => void;
  onClickSender: (senderId: string, e: React.MouseEvent) => void;
  onBack: () => void;
}) {
  const messages = dmConversations[agent.id] ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [agent.id]);

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <ChatHeader agent={agent} onClickProfile={onClickProfile} onBack={onBack} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground/40 text-sm">
            No messages yet
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} agent={agent} onClickSender={onClickSender} />
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2 bg-secondary/30 border border-border rounded-lg px-4 py-2.5 opacity-60">
          <input
            type="text"
            placeholder={`Sign in to message ${agent.name}...`}
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none cursor-not-allowed"
            disabled
          />
          <button className="text-muted-foreground/40 cursor-not-allowed" disabled>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Profile Popover                                                    */
/* ------------------------------------------------------------------ */

function ProfilePopover({
  agent,
  clickPos,
  onClose,
  onMessage,
}: {
  agent: Agent;
  clickPos: { x: number; y: number };
  onClose: () => void;
  onMessage: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = clickPos.x + 8;
    let top = clickPos.y - 20;

    if (left + rect.width > vw - 12) left = clickPos.x - rect.width - 8;
    if (left < 12) left = 12;
    if (top + rect.height > vh - 12) top = vh - rect.height - 12;
    if (top < 12) top = 12;

    setPos({ top, left });
  }, [clickPos]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const { bio, values, skills, tools } = agent.profile ?? {};
  if (!bio) return null;

  const tagClass =
    "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground mr-1.5 mb-1.5";

  return (
    <div
      ref={cardRef}
      className="fixed z-50 bg-background border border-border rounded-xl w-[320px] p-5 shadow-soft-lg"
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        opacity: pos ? 1 : 0,
        animation: pos ? "profile-fade-in 0.15s ease-out" : undefined,
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <Avatar agent={agent} size={44} />
        <div className="min-w-0">
          <h2 className="font-semibold text-foreground text-[15px] leading-tight">{agent.name}</h2>
          <p className="text-muted-foreground text-[12px]">{agent.role}</p>
        </div>
        <span
          className={`text-[10px] rounded-full px-2 py-0.5 shrink-0 ${
            agent.status === "online"
              ? "text-green-600 bg-green-500/10"
              : "text-yellow-600 bg-yellow-500/10"
          }`}
        >
          {agent.status === "online" ? "Online" : "Away"}
        </span>
      </div>

      <p className="text-foreground/80 text-[13px] leading-relaxed mb-4">{bio}</p>

      <div className="space-y-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Values</div>
          <div className="flex flex-wrap">
            {values!.map((v) => <span key={v} className={tagClass}>{v}</span>)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Skills</div>
          <div className="flex flex-wrap">
            {skills!.map((s) => <span key={s} className={tagClass}>{s}</span>)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Tools</div>
          <div className="flex flex-wrap">
            {tools!.map((t) => <span key={t} className={tagClass}>{t}</span>)}
          </div>
        </div>
      </div>

      {agent.id === "1" ? (
        <a
          href="/"
          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-foreground text-background text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          <Globe className="w-3.5 h-3.5" />
          Website
        </a>
      ) : (
        <button
          onClick={onMessage}
          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-foreground text-background text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          <Send className="w-3.5 h-3.5" />
          Message
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main OrgChart                                                      */
/* ------------------------------------------------------------------ */

export function OrgChart() {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [popover, setPopover] = useState<{
    agent: Agent;
    clickPos: { x: number; y: number };
  } | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/status");
        const data = await res.json();
        setIsAuthed(data.authenticated);
      } catch {
        // Not authenticated
      }
    }
    checkAuth();
  }, []);

  const activeAgent = activeAgentId
    ? agents.find((a) => a.id === activeAgentId) ?? null
    : null;

  const openProfile = useCallback((id: string, e: React.MouseEvent) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;
    setPopover({ agent, clickPos: { x: e.clientX, y: e.clientY } });
  }, []);

  const openDm = useCallback((id: string) => {
    setActiveAgentId(id);
    setPopover(null);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthed(false);
    } catch {
      // Ignore
    }
  }, []);

  const mobileShowChat = activeAgent !== null;

  return (
    <div className="h-dvh bg-background flex flex-col">
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className={`${mobileShowChat ? "hidden" : "flex flex-1"} md:flex md:flex-none h-full`}>
          <Sidebar
            activeId={activeAgentId}
            onSelectDm={openDm}
            onClickAvatar={openProfile}
            isAuthed={isAuthed}
            onLoginClick={() => setShowLoginModal(true)}
            onLogout={handleLogout}
          />
        </div>

        {/* Chat area — conditional on auth */}
        {activeAgent ? (
          <div className={`${mobileShowChat ? "flex" : "hidden"} md:flex flex-1 flex-col min-w-0 min-h-0`}>
            {isAuthed && activeAgent.id !== "1" ? (
              <AgentChatPanel
                key={activeAgent.id}
                agent={activeAgent}
                onBack={() => setActiveAgentId(null)}
              />
            ) : isAuthed && activeAgent.id === "1" ? (
              <ChatPanel
                key={activeAgent.id}
                agent={activeAgent}
                onClickProfile={(e) => openProfile(activeAgent.id, e)}
                onClickSender={(senderId, e) => openProfile(senderId, e)}
                onBack={() => setActiveAgentId(null)}
              />
            ) : (
              <PublicSummaryPanel
                key={activeAgent.id}
                agent={activeAgent}
                onBack={() => setActiveAgentId(null)}
                onLoginClick={() => setShowLoginModal(true)}
              />
            )}
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col min-w-0 min-h-0">
            <EmptyChat />
          </div>
        )}
      </div>

      {/* Profile Popover */}
      {popover && (
        <ProfilePopover
          agent={popover.agent}
          clickPos={popover.clickPos}
          onClose={() => setPopover(null)}
          onMessage={() => openDm(popover.agent.id)}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onSuccess={() => {
            setShowLoginModal(false);
            setIsAuthed(true);
          }}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}
