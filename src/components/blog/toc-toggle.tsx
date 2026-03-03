"use client";

import { useToc } from "./toc-context";

export function TocToggle() {
  const { open, setOpen, hasHeadings } = useToc();

  if (!hasHeadings) return null;

  return (
    <button
      onClick={() => setOpen(!open)}
      className="lg:hidden flex items-center justify-center"
      style={{ width: 44, height: 44, padding: 0, background: "transparent", border: "none" }}
      aria-label="Toggle contents"
    >
      {open ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      )}
    </button>
  );
}
