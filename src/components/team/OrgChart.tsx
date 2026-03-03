"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, ChevronDown, X, Send, MessageSquare, Globe } from "lucide-react";

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
  status: "online" | "away";
  profile?: AgentProfile;
}

interface DmMessage {
  from: "user" | "agent";
  timestamp: string;
  text: string;
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Tim",
    role: "Agent Whisperer",
    icon: "\uD83D\uDC64",
    avatar_url: "/images/profile.jpg",
    group: null,
    status: "away",
    profile: {
      bio: "Technically the boss. Mostly delegates everything to agents and takes credit. Currently away — probably napping or pretending to review PRs.",
      values: ["Do less, delegate more", "Naps are productive", "If it works, don't touch it"],
      skills: ["Agent whispering", "Strategic napping", "Approving things I didn't read", "Taking credit"],
      tools: ["Claude Code (it does the work)", "Coffee", "A comfy chair"],
    },
  },
  {
    id: "2",
    name: "Steve",
    role: "Product & Design",
    icon: "\uD83C\uDFA8",
    avatar_url: "/images/steve.jpg",
    group: "Tech",
    status: "online",
    profile: {
      bio: "The one who decides what gets built and how it looks. Turns vague ideas into pixel-perfect interfaces.",
      values: ["Users first, pixels second", "Less but better", "If it's ugly, it's wrong"],
      skills: ["Product strategy", "UI/UX design", "Prototyping", "Design systems"],
      tools: ["Figma", "Framer", "Pencil", "Linear"],
    },
  },
  {
    id: "3",
    name: "Peter",
    role: "Software Engineer",
    icon: "\u2699\uFE0F",
    avatar_url: null,
    group: "Tech",
    status: "online",
    profile: {
      bio: "The one who actually builds it. Takes Steve's pretty mockups and turns them into working code.",
      values: ["Ship it, then polish", "Clean code is kind code", "If it compiles, it ships"],
      skills: ["Full-stack development", "System architecture", "API design", "Performance optimization"],
      tools: ["Claude Code", "Python", "TypeScript", "Next.js"],
    },
  },
  {
    id: "9",
    name: "Tristan",
    role: "Data",
    icon: "\uD83D\uDCCA",
    avatar_url: null,
    group: "Tech",
    status: "online",
    profile: {
      bio: "Makes sure everyone has the numbers they need. Pipes data from everywhere, cleans it up, and serves it on a silver platter so decisions aren't just vibes.",
      values: ["Bad data, bad decisions", "Automate the boring stuff", "Dashboards don't lie"],
      skills: ["Data engineering", "Analytics", "Visualization"],
      tools: ["Python", "SQL", "dbt", "Metabase"],
    },
  },
  {
    id: "4",
    name: "Warren",
    role: "Stock",
    icon: "\uD83D\uDCCA",
    avatar_url: "/images/warren.jpg",
    group: "Invest",
    status: "online",
    profile: {
      bio: "Buys great businesses at fair prices, then does absolutely nothing. Believes the stock market is a device for transferring money from the impatient to the patient.",
      values: ["Buy and hold forever", "Margin of safety", "Be greedy when others are fearful"],
      skills: ["Fundamental analysis", "Financial modeling", "Earnings deep-dives", "Intrinsic value estimation"],
      tools: ["SEC filings", "10-K reports", "Excel", "A very long attention span"],
    },
  },
  {
    id: "5",
    name: "Jim",
    role: "Quant",
    icon: "\uD83D\uDCCA",
    avatar_url: "/images/jim.jpg",
    group: "Invest",
    status: "online",
    profile: {
      bio: "Doesn't care what the company does — only what the numbers say. Builds algorithms that trade while everyone else is sleeping. Emotions are a bug, not a feature.",
      values: ["Data over gut feeling", "Backtest everything", "The model is always right (until it isn't)"],
      skills: ["Quantitative modeling", "Statistical arbitrage", "Backtesting", "Signal extraction"],
      tools: ["Python", "QuantLib", "Jupyter", "Way too many monitors"],
    },
  },
  {
    id: "6",
    name: "Justin",
    role: "Crypto",
    icon: "\uD83E\uDE99",
    avatar_url: "/images/justin.jpg",
    group: "Invest",
    status: "online",
    profile: {
      bio: "Lives on-chain. Finds alpha in DeFi protocols before they trend on Twitter. Has survived three bear markets and still believes in the tech.",
      values: ["Verify, don't trust", "Asymmetric bets only", "If you can't read the contract, don't ape in"],
      skills: ["On-chain analysis", "DeFi yield strategies", "Tokenomics evaluation", "Market timing"],
      tools: ["Dune Analytics", "Etherscan", "DeFiLlama", "A high risk tolerance"],
    },
  },
  {
    id: "7",
    name: "Christopher",
    role: "Director & AIGC",
    icon: "\uD83C\uDFAC",
    avatar_url: "/images/chris.jpg",
    group: "Content",
    status: "online",
    profile: {
      bio: "Part director, part prompt whisperer. Creates cinematic visuals and videos using AI tools that didn't exist six months ago. Treats every frame like it's going to Cannes.",
      values: ["Every frame tells a story", "AI is the brush, not the artist", "Ship fast, iterate faster"],
      skills: ["AI image generation", "Video production", "Visual direction", "Prompt engineering"],
      tools: ["Midjourney", "Runway", "ComfyUI", "After Effects"],
    },
  },
  {
    id: "8",
    name: "Kevin",
    role: "Writer",
    icon: "\uD83D\uDCDD",
    avatar_url: null,
    group: "Content",
    status: "online",
    profile: {
      bio: "Takes Tim's half-baked thoughts and turns them into prose that sounds like Tim actually knows what he's talking about. Ghost-writing with dignity.",
      values: ["Clarity beats cleverness", "Every word earns its place", "Good writing is rewriting"],
      skills: ["Long-form writing", "Copyediting", "Ghostwriting", "Turning rambles into essays"],
      tools: ["Notion", "Claude", "Grammarly", "A red pen"],
    },
  },
];

/* ------------------------------------------------------------------ */
/*  DM Conversations                                                   */
/* ------------------------------------------------------------------ */

const dmConversations: Record<string, DmMessage[]> = {
  "2": [
    { from: "user", timestamp: "Mon 9:00 AM", text: "Steve, I need you to redesign the team page. Slack-style layout — sidebar with members, click to open DM chat." },
    { from: "agent", timestamp: "Mon 9:05 AM", text: "Got it. I'll sketch out wireframes first — sidebar tree + chat panel + profile popover. Give me a couple hours." },
    { from: "agent", timestamp: "Mon 11:30 AM", text: "Progress update: wireframes done. Going with 260px sidebar, flat message list, and a compact profile card. Starting hi-fi mockups now." },
    { from: "user", timestamp: "Mon 11:35 AM", text: "Looks good. Make sure it works well on mobile too — collapsible sidebar." },
    { from: "agent", timestamp: "Mon 3:00 PM", text: "Done. Mobile breakpoint at md — sidebar collapses to a toggle. All screens exported to Figma. Ready for dev handoff." },
  ],
  "3": [
    { from: "user", timestamp: "Tue 10:00 AM", text: "Peter, set up the API endpoints for the agent chat system. Need send/receive message routes and a task assignment endpoint." },
    { from: "agent", timestamp: "Tue 10:10 AM", text: "On it. I'll use Next.js API routes with a simple in-memory store for now. Schema: messages, tasks, agent assignments." },
    { from: "agent", timestamp: "Tue 2:00 PM", text: "Midday update: POST /api/messages and GET /api/messages/:agentId are live in staging. Working on the task assignment endpoint next." },
    { from: "agent", timestamp: "Tue 5:30 PM", text: "All endpoints done and tested. POST /api/tasks for assignments, GET /api/tasks/:agentId for status. Deployed to staging." },
  ],
  "9": [
    { from: "user", timestamp: "Wed 9:00 AM", text: "Tristan, I need a dashboard showing agent task completion rates and response times. Pull data from the tasks API." },
    { from: "agent", timestamp: "Wed 9:15 AM", text: "Got it. I'll build a pipeline: tasks API → aggregation → daily metrics. Will have a prototype by EOD." },
    { from: "agent", timestamp: "Wed 4:00 PM", text: "Progress: pipeline running. Average task completion: 94%. Response time P50: 12min, P95: 45min. Dashboard draft ready for review." },
  ],
  "4": [
    { from: "user", timestamp: "Thu 8:30 AM", text: "Warren, analyze the latest Q4 earnings. Focus on undervalued industrials — I want a shortlist of 5 names with your conviction level." },
    { from: "agent", timestamp: "Thu 8:45 AM", text: "Starting the screen now. Filtering for P/E below sector average, positive earnings surprise, and strong free cash flow." },
    { from: "agent", timestamp: "Thu 12:00 PM", text: "Shortlist ready: CAT, EMR, ITW, PH, ROK. All trading below intrinsic value with 15-25% margin of safety. Full report attached." },
    { from: "user", timestamp: "Thu 12:10 PM", text: "Great work. Add position sizing recommendations based on our current portfolio allocation." },
    { from: "agent", timestamp: "Thu 2:00 PM", text: "Done. Recommended 2-3% allocation each, keeping total industrials exposure under 15%. Updated the portfolio model." },
  ],
  "5": [
    { from: "user", timestamp: "Fri 9:00 AM", text: "Jim, run a backtest on the new multi-factor model. 10-year window, monthly rebalance. Compare against SPY benchmark." },
    { from: "agent", timestamp: "Fri 9:20 AM", text: "Running now. Factors: value, momentum, quality, low-vol. Will have results in about 2 hours." },
    { from: "agent", timestamp: "Fri 11:30 AM", text: "Backtest complete. CAGR 14.2% vs SPY 10.8%. Sharpe 1.31 vs 0.82. Max drawdown -18% vs -34%. Full tear sheet ready." },
  ],
  "6": [
    { from: "user", timestamp: "Sat 10:00 AM", text: "Justin, monitor the L2 ecosystem this week. Flag any unusual on-chain activity or TVL shifts above 10%." },
    { from: "agent", timestamp: "Sat 10:15 AM", text: "Setting up alerts now. Watching Arbitrum, Optimism, Base, and zkSync. Will send daily summaries." },
    { from: "agent", timestamp: "Sun 9:00 AM", text: "Daily report: Base TVL up 12% — driven by a new DEX launch. Arbitrum stable. No red flags on security front. Gas fees remain low." },
    { from: "agent", timestamp: "Mon 9:00 AM", text: "Weekly wrap: Base was the big mover (+18% TVL). Spotted an early DeFi protocol worth watching — solid team, audited contracts. Sending detailed analysis." },
  ],
  "7": [
    { from: "user", timestamp: "Tue 1:00 PM", text: "Christopher, create visual assets for the new blog post: hero image, 3 inline illustrations, and social cards for Twitter/LinkedIn." },
    { from: "agent", timestamp: "Tue 1:15 PM", text: "On it. Going with a clean, modern style — muted tones, subtle gradients. Hero image will feature an abstract team/network visual." },
    { from: "agent", timestamp: "Tue 4:00 PM", text: "Hero image and 2 illustrations done. Working on the last illustration and social cards now. Preview shared in the assets folder." },
    { from: "agent", timestamp: "Tue 6:00 PM", text: "All assets delivered. Hero: 1200x630, illustrations: 800x450, social cards: Twitter 1200x675 + LinkedIn 1200x627. All in /assets/blog/." },
  ],
  "8": [
    { from: "user", timestamp: "Wed 10:00 AM", text: "Kevin, write a blog post: 'Building an AI Agent Team from Scratch.' Target 1500 words. Tone: practical, conversational, first-person." },
    { from: "agent", timestamp: "Wed 10:20 AM", text: "Great topic. I'll structure it as: why agents, the team design, lessons learned, what's next. First draft by 3pm." },
    { from: "agent", timestamp: "Wed 3:00 PM", text: "Draft done — 1,480 words. Strong hook, clean narrative arc. A few spots could use your voice. Ready for review in /content/blog/." },
    { from: "user", timestamp: "Wed 3:30 PM", text: "Nice work. Tighten the intro — lead with the hook, cut the setup. And add a section on what surprised me." },
    { from: "agent", timestamp: "Wed 5:00 PM", text: "Revised. Intro is now 40% shorter, leads with the provocation. Added 'Surprises' section before the conclusion. Final at 1,520 words." },
  ],
};

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
        <span className="text-[13px] md:text-[12px] text-muted-foreground/50 ml-auto">{groupAgents.length}</span>
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
}: {
  activeId: string | null;
  onSelectDm: (id: string) => void;
  onClickAvatar: (id: string, e: React.MouseEvent) => void;
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat Panel                                                         */
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
      {/* Back button — mobile only */}
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

function ChatInputBar({ agentName }: { agentName: string }) {
  return (
    <div className="px-4 py-3 border-t border-border shrink-0">
      <div className="flex items-center gap-2 bg-secondary/30 border border-border rounded-lg px-4 py-2.5 opacity-60">
        <input
          type="text"
          placeholder={`Sign in to message ${agentName}...`}
          className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none cursor-not-allowed"
          disabled
        />
        <button className="text-muted-foreground/40 cursor-not-allowed" disabled>
          <Send className="w-4 h-4" />
        </button>
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

      <ChatInputBar agentName={agent.name} />
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

    // Clamp to viewport
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
          {agent.status === "online" ? "online" : "away"}
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

      {/* Action button */}
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

  // On mobile: show sidebar by default, hide when a chat is open
  const mobileShowChat = activeAgent !== null;

  return (
    <div className="h-dvh bg-background flex flex-col">
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar — always on desktop, toggle on mobile */}
        <div className={`${mobileShowChat ? "hidden" : "flex flex-1"} md:flex md:flex-none h-full`}>
          <Sidebar
            activeId={activeAgentId}
            onSelectDm={(id) => {
              openDm(id);
            }}
            onClickAvatar={(id, e) => {
              openProfile(id, e);
            }}
          />
        </div>

        {/* Chat — desktop always, mobile only when agent selected */}
        {activeAgent ? (
          <div className={`${mobileShowChat ? "flex" : "hidden"} md:flex flex-1 flex-col min-w-0 min-h-0`}>
            <ChatPanel
              key={activeAgent.id}
              agent={activeAgent}
              onClickProfile={(e) => openProfile(activeAgent.id, e)}
              onClickSender={(senderId, e) => openProfile(senderId, e)}
              onBack={() => setActiveAgentId(null)}
            />
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
    </div>
  );
}
