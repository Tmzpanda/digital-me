"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";

export function AvatarEasterEgg({
  profileImage,
  name,
}: {
  profileImage: string;
  name: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    const el = buttonRef.current;
    if (!el) return;

    // Calculate avatar center position as ratio of viewport
    const rect = el.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Burst 1: main confetti explosion
    confetti({
      particleCount: 80,
      spread: 360,
      origin: { x, y },
      startVelocity: 25,
      gravity: 0.6,
      ticks: 80,
      colors: ["#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#10b981"],
      shapes: ["circle", "square"],
      scalar: 0.9,
    });

    // Burst 2: slower sparkle follow-up
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 360,
        origin: { x, y },
        startVelocity: 15,
        gravity: 0.4,
        ticks: 60,
        colors: ["#fbbf24", "#f472b6", "#a78bfa"],
        shapes: ["circle"],
        scalar: 0.6,
      });
    }, 150);

    // Avatar bounce
    el.style.animation = "none";
    el.offsetHeight; // reflow
    el.style.animation = "avatar-bounce 0.5s cubic-bezier(0.34,1.56,0.64,1)";
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className="avatar-glow relative mb-12 inline-block group"
      aria-label="Easter egg animation"
    >
      <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-border/50 shadow-soft-lg ring-4 ring-background">
        <Image
          src={profileImage}
          alt={name}
          width={320}
          height={320}
          quality={95}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </button>
  );
}
