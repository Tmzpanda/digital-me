"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { navItems } from "@/lib/navigation-config";
import { AvatarEasterEgg } from "./AvatarEasterEgg";

const personalInfo = {
  name: "Tianming Zhang",
  chineseName: "张天明",
  profileImage: "/images/profile.jpg",
};

export function LandingHero() {
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

  const handleNavigate = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setLeaving(true);
    setTimeout(() => router.push(href), 450);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
      style={{
        overflow: "hidden",
        transform: leaving ? "translateX(-100%)" : "none",
        opacity: leaving ? 0 : 1,
        transition: leaving
          ? "transform 0.45s ease-in-out, opacity 0.4s ease-in-out"
          : "none",
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Profile Photo */}
        <AvatarEasterEgg
          profileImage={personalInfo.profileImage}
          name={personalInfo.name}
        />

        {/* Navigation Cards */}
        <div className="flex flex-wrap justify-center gap-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavigate(e, item.href)}
              className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200 hover:shadow-soft cursor-pointer w-full sm:w-[calc((100%-2rem)/3)]"
            >
              <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.label}
                <span className="inline-block ml-1 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
