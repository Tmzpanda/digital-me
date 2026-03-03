"use client";

import { useBlogTheme } from "./blog-theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggle } = useBlogTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span style={{ display: "inline-block", width: 40, height: 20 }} />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      style={{
        position: "relative",
        display: "inline-block",
        width: 40,
        height: 20,
        padding: 0,
        border: "1px solid var(--blog-text)",
        borderRadius: 20,
        backgroundColor: isDark ? "var(--blog-text-secondary)" : "var(--blog-toggle-bg)",
        cursor: "pointer",
        transition: "background-color 0.2s",
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: isDark ? "var(--blog-bg)" : "var(--blog-text)",
          transform: isDark ? "translateX(20px)" : "translateX(0)",
          transition: "transform 0.2s",
        }}
      />
    </button>
  );
}
