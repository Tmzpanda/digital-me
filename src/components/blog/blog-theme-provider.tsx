"use client";

import { createContext, useContext, useEffect, useState } from "react";

type BlogTheme = "light" | "dark";

const BlogThemeContext = createContext<{
  theme: BlogTheme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function BlogThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<BlogTheme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("blog-theme") as BlogTheme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  const toggle = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("blog-theme", next);
      return next;
    });
  };

  return (
    <BlogThemeContext.Provider value={{ theme, toggle }}>
      <div data-blog-theme={theme} className="blog-theme" suppressHydrationWarning>
        {children}
      </div>
    </BlogThemeContext.Provider>
  );
}

export function useBlogTheme() {
  return useContext(BlogThemeContext);
}
