"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  avatar_url: string | null;
  group: string | null;
  status: "active" | "development";
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
  },
  {
    id: "2",
    name: "Steve",
    role: "Product & Design",
    icon: "\uD83C\uDFA8",
    avatar_url: "/images/steve.jpg",
    group: "Tech",
    status: "development",
  },
  {
    id: "3",
    name: "TBD",
    role: "Software & Data",
    icon: "\u2699\uFE0F",
    avatar_url: null,
    group: "Tech",
    status: "development",
  },
  {
    id: "4",
    name: "Warren",
    role: "Stock",
    icon: "\uD83D\uDCCA",
    avatar_url: "/images/warren.jpg",
    group: "Invest",
    status: "development",
  },
  {
    id: "5",
    name: "TBD",
    role: "Crypto",
    icon: "\uD83E\uDE99",
    avatar_url: null,
    group: "Invest",
    status: "development",
  },
  {
    id: "6",
    name: "TBD",
    role: "Writer",
    icon: "\uD83D\uDCDD",
    avatar_url: null,
    group: "Content",
    status: "development",
  },
  {
    id: "7",
    name: "TBD",
    role: "AIGC",
    icon: "\uD83D\uDDBC\uFE0F",
    avatar_url: null,
    group: "Content",
    status: "development",
  },
];

/* ------------------------------------------------------------------ */
/*  OrgCard                                                            */
/* ------------------------------------------------------------------ */

function OrgCard({ agent }: { agent: Agent }) {
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
      className="flex flex-col items-center group transition-transform duration-150 hover:scale-[1.02]"
      style={{ width: "100%" }}
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
          border: "1px solid hsl(0,0%,90%)",
          borderRadius: 20,
          background: "#fff",
          boxShadow: "rgba(0,0,0,0.05) 0px 1px 3px 0px",
          textAlign: "center",
          width: "100%",
          transition: "box-shadow 0.15s ease",
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
/*  Main OrgChart                                                      */
/* ------------------------------------------------------------------ */

export function OrgChart() {
  const [expanded, setExpanded] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();

  // Reset on bfcache restore (browser back after full navigation)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setLeaving(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleVisitOffice = (e: React.MouseEvent) => {
    e.preventDefault();
    setLeaving(true);
    setTimeout(() => router.push("/office"), 450);
  };

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
      style={{
        background: "#fff",
        overflow: "hidden",
        transform: leaving ? "translateX(-100%)" : "none",
        opacity: leaving ? 0 : 1,
        transition: leaving
          ? "transform 0.45s ease-in-out, opacity 0.4s ease-in-out"
          : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px 32px" }}>
        {/* ─── ROOT CARD ─── */}
        <div className="flex flex-col items-center">
          <Link href="/" style={{ width: 200, cursor: "pointer" }}>
            <OrgCard agent={root} />
          </Link>
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
                      <div key={agent.id} style={{ width: 160 }}>
                        <OrgCard agent={agent} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Ungrouped agents (e.g. Assistant) */}
              {ungrouped.map((agent) => (
                <div key={agent.id} style={{ width: 160 }}>
                  <OrgCard agent={agent} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Visit our office */}
      <div className="flex justify-center" style={{ paddingBottom: 64, paddingTop: 32 }}>
        <a
          href="/office"
          onClick={handleVisitOffice}
          className="group inline-flex items-center gap-1.5 text-base text-muted-foreground/70 hover:text-muted-foreground transition-colors cursor-pointer"
        >
          Visit our office
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
