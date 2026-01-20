"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface SocialLinksProps {
  links?: SocialLink[];
}

const defaultLinks: SocialLink[] = [
  {
    name: "X (Twitter)",
    url: "https://twitter.com/yourusername",
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/yourusername",
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    name: "GitHub",
    url: "https://github.com/yourusername",
    icon: <Github className="w-5 h-5" />,
  },
];

export function SocialLinks({ links = defaultLinks }: SocialLinksProps) {
  return (
    <section className="flex flex-wrap justify-center gap-3 py-6 px-4">
      {links.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="lg"
          className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
          asChild
        >
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.icon}
            <span className="hidden sm:inline font-medium">{link.name}</span>
          </a>
        </Button>
      ))}
    </section>
  );
}

export { Mail };
