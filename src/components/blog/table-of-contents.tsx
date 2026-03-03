"use client";

import { useEffect, useState, useCallback } from "react";
import { useToc } from "./toc-context";

export interface TocHeading {
  depth: number;
  text: string;
  id: string;
}

function useActiveHeading(headings: TocHeading[]) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  return { activeId, setActiveId };
}

function TocList({ headings, activeId, onClickLink }: {
  headings: TocHeading[];
  activeId: string;
  onClickLink: (id: string) => void;
}) {
  return (
    <>
      <h2 className="font-serif text-[1.6em] font-semibold leading-[1.2]">
        Contents
      </h2>
      <ul className="list-none pl-0 mt-[30px]">
        {headings.map((h) => (
          <li key={h.id} className="mb-[0.2em]">
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                onClickLink(h.id);
                const el = document.getElementById(h.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="no-underline inline-block transition-opacity duration-200"
              style={{
                opacity: activeId === h.id ? 1 : 0.5,
                fontSize: h.depth === 3 ? "0.9em" : undefined,
                paddingLeft: h.depth === 3 ? "1em" : undefined,
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Desktop: fixed sidebar, left-aligned */
export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const { activeId, setActiveId } = useActiveHeading(headings);
  const { setHasHeadings } = useToc();

  useEffect(() => {
    setHasHeadings(headings.length > 0);
    return () => setHasHeadings(false);
  }, [headings, setHasHeadings]);

  if (headings.length === 0) return null;

  const handleClick = useCallback((id: string) => {
    setActiveId(id);
  }, [setActiveId]);

  return (
    <aside
      className="hidden lg:block fixed left-0 top-0 bottom-0 overflow-y-auto"
      style={{
        width: "22%",
        maxWidth: "23rem",
        padding: "130px 25px 25px",
        scrollbarWidth: "none",
      }}
    >
      <TocList headings={headings} activeId={activeId} onClickLink={handleClick} />
    </aside>
  );
}

/** Mobile: full-screen drawer with fade animation */
export function TableOfContentsMobile({ headings }: { headings: TocHeading[] }) {
  const { activeId, setActiveId } = useActiveHeading(headings);
  const { open, setOpen } = useToc();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleClick = useCallback((id: string) => {
    setActiveId(id);
    setOpen(false);
  }, [setActiveId, setOpen]);

  if (headings.length === 0) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 z-40 overflow-y-auto"
      style={{
        backgroundColor: "var(--blog-bg)",
        padding: "100px 2rem 2rem",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}
    >
      <div className="mx-auto max-w-[38.75rem]">
        <TocList headings={headings} activeId={activeId} onClickLink={handleClick} />
      </div>
    </div>
  );
}
