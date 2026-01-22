"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { id: "all", label: "All" },
  { id: "tech", label: "科技" },
  { id: "investment", label: "投资" },
  { id: "worldview", label: "世界观" },
  { id: "people", label: "人" },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      {/* Category Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-4 py-3 overflow-x-auto scrollbar-hide">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-1">
            {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap
                    ${
                      activeCategory === category.id
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-muted-foreground mb-8">
            Exploring tech, markets, and the forces that shape our world.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
