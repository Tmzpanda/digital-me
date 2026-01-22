"use client";

import { SidebarChat } from "@/components/chat/SidebarChat";
import Image from "next/image";
import Link from "next/link";

// ============================================
// CUSTOMIZE YOUR INFO HERE
// ============================================
const personalInfo = {
  name: "Tianming (Tim) Zhang",              // Your full name
  nickname: "Tim",                      // Your nickname
  tagline: "Data Engineer at Meta",     // Your title/role
  subtitle: "Google Cloud Certified Architect, Data & ML Engineer",  // Subtitle/certifications
  profileImage: "/images/profile.jpg",  // Profile photo path
};

// Social/Action links with brand colors
const actionLinks = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/tmzpanda",
    icon: (
      <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    label: "LinkedIn",
  },
  {
    name: "GitHub",
    url: "https://github.com/tmzpanda",
    icon: (
      <svg className="w-5 h-5" fill="#333" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    label: "GitHub",
  },
  {
    name: "Gmail",
    url: "mailto:tmzpanda@gmail.com",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"/>
        <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"/>
        <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/>
        <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"/>
        <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"/>
      </svg>
    ),
    label: "Gmail",
  },
];

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl mx-auto relative">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-16 items-center">

          {/* Left Side - Profile & Links */}
          <div className="flex flex-col items-center text-center lg:items-center lg:text-center">
            {/* Profile Photo */}
            <div className="avatar-glow relative mb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-border/50 shadow-soft-lg ring-4 ring-background">
                <Image
                  src={personalInfo.profileImage}
                  alt={personalInfo.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Name & Title */}
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
              {personalInfo.name}
            </h1>
            <p className="text-muted-foreground font-medium mb-1">
              {personalInfo.tagline}
            </p>
            <p className="text-sm text-muted-foreground/60 mb-8">
              {personalInfo.subtitle}
            </p>

            {/* Action Links - Styled Buttons */}
            <div className="flex justify-center gap-3 mb-8">
              {actionLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 bg-card/50 text-sm font-medium"
                >
                  {link.icon}
                  <span className="text-foreground/80">{link.label}</span>
                </a>
              ))}
            </div>

            {/* CTA Text - Clickable */}
            <button
              onClick={() => {
                const input = document.getElementById("chat-input");
                if (input) input.focus();
              }}
              className="group text-sm text-muted-foreground/70 leading-relaxed hidden lg:flex items-center gap-1 cursor-pointer hover:text-muted-foreground transition-colors"
            >
              Ask my AI anything
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </div>

          {/* Right Side - Chatbot (Main Feature) */}
          <div className="w-full">
            <div className="border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm shadow-soft-lg overflow-hidden h-[500px] lg:h-[580px] flex flex-col transition-shadow duration-300 hover:shadow-soft">
              <SidebarChat />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
