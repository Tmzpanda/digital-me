"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeroProps {
  name?: string;
  tagline?: string;
  profileImage?: string;
}

export function Hero({
  name = "Your Name",
  tagline = "Software Engineer | AI Enthusiast | Builder",
  profileImage = "/images/profile.jpg",
}: HeroProps) {
  return (
    <section className="flex flex-col items-center justify-center pt-16 pb-8 px-4">
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full blur-lg" />
        <Avatar className="relative w-36 h-36 md:w-44 md:h-44 border-4 border-white shadow-soft-lg">
          <AvatarImage src={profileImage} alt={name} className="object-cover" />
          <AvatarFallback className="text-4xl font-light bg-muted text-muted-foreground">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>
      <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-3 text-center tracking-tight">
        {name}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground text-center max-w-lg leading-relaxed">
        {tagline}
      </p>
    </section>
  );
}
