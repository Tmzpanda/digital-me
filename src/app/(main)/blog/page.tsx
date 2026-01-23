"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPostMeta, BlogCategory, categoryLabels } from "@/lib/blog-types";

const categories: { id: BlogCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tech", label: "科技" },
  { id: "investment", label: "投资" },
  { id: "worldview", label: "世界观" },
  { id: "people", label: "人" },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "all">("all");
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

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
      <div className="max-w-3xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                          {categoryLabels[post.category]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.date}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          · {post.readingTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
