"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface AgentProfile {
  bio: string;
  values: string[];
  skills: string[];
  tools: string[];
}

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  avatar_url: string | null;
  group: string | null;
  status: "active" | "development";
  profile?: AgentProfile;
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Tim",
    role: "Team Lead",
    icon: "\uD83D\uDC64",
    avatar_url: "/images/profile.jpg",
    group: null,
    status: "active",
    profile: {
      bio: "The human behind the team. Sets direction, makes decisions, and keeps everyone aligned.",
      values: ["Ownership", "Move fast", "Keep it simple"],
      skills: ["Strategy", "Product thinking", "Data engineering", "Full-stack development"],
      tools: ["Claude Code", "Cursor", "VS Code", "Figma"],
    },
  },
  {
    id: "2",
    name: "Steve",
    role: "Product & Design",
    icon: "\uD83C\uDFA8",
    avatar_url: "/images/steve.jpg",
    group: "Tech",
    status: "development",
    profile: {
      bio: "Turns ideas into interfaces. Obsessed with details and user experience.",
      values: ["Design is how it works", "Less but better", "Taste matters"],
      skills: ["UI/UX design", "Prototyping", "Design systems", "Frontend development"],
      tools: ["Figma", "Framer", "Pencil", "Tailwind CSS"],
    },
  },
  {
    id: "3",
    name: "Peter",
    role: "Engineering & Data",
    icon: "\u2699\uFE0F",
    avatar_url: null,
    group: "Tech",
    status: "development",
    profile: {
      bio: "Builds the backend, pipelines, and infrastructure that powers everything.",
      values: ["Reliability first", "Automate everything", "Data-driven"],
      skills: ["Backend engineering", "Data pipelines", "Cloud infrastructure", "APIs"],
      tools: ["Python", "Spark", "AWS", "PostgreSQL"],
    },
  },
  {
    id: "4",
    name: "Warren",
    role: "Stock",
    icon: "\uD83D\uDCCA",
    avatar_url: "/images/warren.jpg",
    group: "Invest",
    status: "development",
    profile: {
      bio: "Patient capital allocator. Finds value where others see noise.",
      values: ["Long-term thinking", "Margin of safety", "Circle of competence"],
      skills: ["Fundamental analysis", "Financial modeling", "Risk assessment", "Portfolio management"],
      tools: ["SEC filings", "Bloomberg", "Python", "Excel"],
    },
  },
  {
    id: "5",
    name: "Jim",
    role: "Quant",
    icon: "\uD83D\uDCCA",
    avatar_url: null,
    group: "Invest",
    status: "development",
    profile: {
      bio: "Patient capital allocator. Finds value where others see noise.",
      values: ["Long-term thinking", "Margin of safety", "Circle of competence"],
      skills: ["Fundamental analysis", "Financial modeling", "Risk assessment", "Portfolio management"],
      tools: ["SEC filings", "Bloomberg", "Python", "Excel"],
    },
  },
  {
    id: "6",
    name: "Justin",
    role: "Crypto",
    icon: "\uD83E\uDE99",
    avatar_url: "/images/justin.jpg",
    group: "Invest",
    status: "development",
    profile: {
      bio: "Navigates the on-chain world. Finds alpha in decentralized markets.",
      values: ["Verify, don't trust", "Asymmetric bets", "Stay curious"],
      skills: ["On-chain analysis", "DeFi strategies", "Tokenomics", "Market timing"],
      tools: ["Dune Analytics", "Etherscan", "DeFiLlama", "Python"],
    },
  },
  {
    id: "7",
    name: "Christopher",
    role: "Director",
    icon: "\uD83D\uDDBC\uFE0F",
    avatar_url: "/images/chris.jpg",
    group: "Content",
    status: "development",
    profile: {
      bio: "Creates visual content with AI. From concepts to polished assets.",
      values: ["Visual storytelling", "Push the medium", "Speed + quality"],
      skills: ["Image generation", "Video production", "Prompt engineering", "Visual design"],
      tools: ["Midjourney", "Runway", "ComfyUI", "Photoshop"],
    },
  },
  {
    id: "8",
    name: "Kevin",
    role: "Writer",
    icon: "\uD83D\uDCDD",
    avatar_url: null,
    group: "Content",
    status: "development",
    profile: {
      bio: "Turns complex thoughts into clear, compelling writing.",
      values: ["Clarity over cleverness", "Write to think", "Every word earns its place"],
      skills: ["Long-form writing", "Copywriting", "Editing", "Storytelling"],
      tools: ["Notion", "Claude", "Grammarly", "Markdown"],
    },
  },
];

/* ------------------------------------------------------------------ */
/*  OrgCard                                                            */
/* ------------------------------------------------------------------ */

function OrgCard({
  agent,
  selected,
  onClick,
}: {
  agent: Agent;
  selected?: boolean;
  onClick?: () => void;
}) {
  const photoSize = 64;

  const initials = agent.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hue =
    [...agent.name].reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0) %
    360;

  return (
    <div
      data-card="true"
      className="flex flex-col items-center group transition-transform duration-150 hover:scale-[1.02]"
      style={{ width: "100%", cursor: onClick ? "pointer" : undefined }}
      onClick={onClick}
    >
      {agent.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={agent.avatar_url}
          alt={agent.name}
          className="shrink-0"
          style={{
            width: photoSize,
            height: photoSize,
            borderRadius: "50%",
            objectFit: "cover",
            position: "relative",
            zIndex: 1,
            boxShadow: selected ? "0 0 0 3px #111321" : undefined,
          }}
        />
      ) : (
        <div
          className="shrink-0"
          style={{
            width: photoSize,
            height: photoSize,
            borderRadius: "50%",
            backgroundColor: `oklch(0.65 0.15 ${hue})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
            fontSize: 18,
            position: "relative",
            zIndex: 1,
            boxShadow: selected ? "0 0 0 3px #111321" : undefined,
          }}
        >
          {initials}
        </div>
      )}

      <div
        className="group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        style={{
          marginTop: -(photoSize / 2),
          paddingTop: photoSize / 2 + 10,
          paddingBottom: 16,
          paddingLeft: 20,
          paddingRight: 20,
          border: selected
            ? "1px solid #111321"
            : "1px solid hsl(0,0%,90%)",
          borderRadius: 20,
          background: "#fff",
          boxShadow: selected
            ? "0 4px 16px rgba(0,0,0,0.08)"
            : "rgba(0,0,0,0.05) 0px 1px 3px 0px",
          textAlign: "center",
          width: "100%",
          transition: "all 0.15s ease",
        }}
      >
        <div
          className="group-hover:underline"
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: "#111321",
            lineHeight: 1.3,
          }}
        >
          {agent.name}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#6F7179",
            marginTop: 3,
            lineHeight: 1.4,
          }}
        >
          {agent.role}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FloatingProfile                                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  AgentSlot — wraps a card + its floating profile                    */
/* ------------------------------------------------------------------ */

const PANEL_W = 300;
const PANEL_PAD = 12;

function AgentSlot({
  agent,
  selected,
  onSelect,
  width,
}: {
  agent: Agent;
  selected: boolean;
  onSelect: () => void;
  width: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!selected) { setShow(false); return; }
    if (!cardRef.current) return;

    // Scroll so the card is near the top, leaving room below for the panel
    const rect = cardRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const targetTop = vh * 0.15;
    const offset = rect.top - targetTop;

    if (Math.abs(offset) > 30) {
      window.scrollBy({ top: offset, behavior: "smooth" });
      const timer = setTimeout(() => {
        setShow(true);
        // After panel renders, scroll it into view if needed
        requestAnimationFrame(() => {
          panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }, 400);
      return () => clearTimeout(timer);
    }

    setShow(true);
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Compute horizontal offset so panel stays within viewport
  const panelLeft = (() => {
    if (!cardRef.current) return 0;
    const rect = cardRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const centered = rect.left + rect.width / 2 - PANEL_W / 2;
    const clamped = Math.max(PANEL_PAD, Math.min(centered, vw - PANEL_W - PANEL_PAD));
    // Return as offset from the card's left edge
    return clamped - rect.left;
  })();

  const { bio, values, skills, tools } = agent.profile ?? {};

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#9a9ba0",
    marginBottom: 6,
  };
  const tagStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    background: "rgba(0,0,0,0.04)",
    color: "#444",
    margin: "0 4px 4px 0",
  };

  return (
    <div ref={cardRef} style={{ width, position: "relative" }}>
      <OrgCard agent={agent} selected={selected} onClick={onSelect} />
      {show && agent.profile && (
        <div
          ref={panelRef}
          data-profile="true"
          style={{
            position: "absolute",
            top: "100%",
            left: panelLeft,
            marginTop: 10,
            width: PANEL_W,
            padding: "20px 22px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            zIndex: 50,
            animation: "profile-fade-in 0.2s ease-out",
          }}
        >
          <p style={{ fontSize: 13, color: "#333", lineHeight: 1.6, marginBottom: 16 }}>
            {bio}
          </p>
          <div style={{ marginBottom: 12 }}>
            <div style={labelStyle}>Character & Values</div>
            <div>{values!.map((v) => <span key={v} style={tagStyle}>{v}</span>)}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={labelStyle}>Skills</div>
            <div>{skills!.map((s) => <span key={s} style={tagStyle}>{s}</span>)}</div>
          </div>
          <div>
            <div style={labelStyle}>Tools</div>
            <div>{tools!.map((t) => <span key={t} style={tagStyle}>{t}</span>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main OrgChart                                                      */
/* ------------------------------------------------------------------ */

export function OrgChart() {
  const [expanded, setExpanded] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggleAgent = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  // Click outside to dismiss
  useEffect(() => {
    if (!selectedId) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-profile]") || target.closest("[data-card]")) return;
      setSelectedId(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [selectedId]);

  const root = agents.find((a) => a.id === "1")!;
  const reports = agents.filter((a) => a.id !== "1");

  // Group reports: grouped agents + ungrouped (standalone)
  const groupOrder = ["Tech", "Invest", "Content"];
  const grouped = groupOrder
    .map((g) => ({
      label: g === "Tech" ? "Tech" : g === "Invest" ? "Investment" : g,
      agents: reports.filter((a) => a.group === g),
    }))
    .filter((g) => g.agents.length > 0);
  const ungrouped = reports.filter((a) => !a.group);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#fff" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px 32px", paddingBottom: 400 }}>
        {/* ─── ROOT CARD ─── */}
        <div className="flex flex-col items-center">
          <AgentSlot
            agent={root}
            selected={selectedId === root.id}
            onSelect={() => toggleAgent(root.id)}
            width={200}
          />
        </div>

        {/* ─── PILL sits on card bottom edge + LINE to bracket ─── */}
        {reports.length > 0 && (
          <div className="flex flex-col items-center">
            {/* Pill overlapping the card's bottom border */}
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                marginTop: -13,
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                gap: 4,
                height: 26,
                padding: "0 10px",
                borderRadius: 13,
                background: expanded ? "#111321" : "#fff",
                color: expanded ? "#fff" : "#111321",
                border: expanded
                  ? "1px solid #111321"
                  : "1px solid hsl(0,0%,86%)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {reports.length}
              {expanded ? (
                <ChevronUp style={{ width: 12, height: 12 }} />
              ) : (
                <ChevronDown style={{ width: 12, height: 12 }} />
              )}
            </button>
            {/* Vertical line from pill to bracket */}
            {expanded && (
              <div style={{ width: 1, height: 24, background: "hsl(0,0%,88%)" }} />
            )}
          </div>
        )}

        {/* ─── BRACKET (short hooks at ends) + CONTENT ─── */}
        {expanded && reports.length > 0 && (
          <>
            {/* Bracket line: top border with short curved hooks */}
            <div
              style={{
                borderTop: "1px solid hsl(0,0%,86%)",
                borderLeft: "1px solid hsl(0,0%,86%)",
                borderRight: "1px solid hsl(0,0%,86%)",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                height: 36,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                padding: "0 14px 6px",
              }}
            >
              <div />

              <button
                onClick={() => setExpanded(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#6F7179",
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Collapse
                <ChevronUp style={{ width: 14, height: 14 }} />
              </button>
            </div>

            {/* Reports — grouped */}
            <div
              style={{
                padding: "12px 14px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: "center",
              }}
            >
              {grouped.map((group) => (
                <div
                  key={group.label}
                  style={{
                    border: "1px dashed hsl(0,0%,85%)",
                    borderRadius: 14,
                    padding: "10px 12px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#9a9ba0",
                      marginBottom: 10,
                      paddingLeft: 4,
                    }}
                  >
                    {group.label}
                  </div>
                  <div style={{ display: "flex", gap: 14 }}>
                    {group.agents.map((agent) => (
                      <AgentSlot
                        key={agent.id}
                        agent={agent}
                        selected={selectedId === agent.id}
                        onSelect={() => toggleAgent(agent.id)}
                        width={160}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Ungrouped agents (e.g. Assistant) */}
              {ungrouped.map((agent) => (
                <AgentSlot
                  key={agent.id}
                  agent={agent}
                  selected={selectedId === agent.id}
                  onSelect={() => toggleAgent(agent.id)}
                  width={160}
                />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
