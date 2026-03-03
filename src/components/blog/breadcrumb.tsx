"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function HeaderTitle({ titles }: { titles: Record<string, string> }) {
  const pathname = usePathname();
  // Strip /blog/ prefix to get the slug
  const slug = pathname.replace(/^\/blog\/?/, "").replace(/\/$/, "");
  const title = slug ? titles[slug] : null;
  const isArticle = !!title;
  const [showBreadcrumb, setShowBreadcrumb] = useState(isArticle);
  const prevArticleRef = useRef(isArticle);

  useEffect(() => {
    if (isArticle && !prevArticleRef.current) {
      const timer = setTimeout(() => setShowBreadcrumb(true), 150);
      return () => clearTimeout(timer);
    } else if (!isArticle) {
      setShowBreadcrumb(false);
    } else {
      setShowBreadcrumb(true);
    }
    prevArticleRef.current = isArticle;
  }, [isArticle]);

  return (
    <div className="flex items-baseline min-w-0">
      <Link
        href="/blog"
        className="font-serif no-underline shrink-0"
        style={{
          fontSize: isArticle ? "0.85em" : "1.44em",
          fontWeight: 600,
          lineHeight: 1,
          color: "var(--blog-text)",
          transition: "font-size 0.3s ease, color 0.3s ease",
        }}
      >
        天色渐明
      </Link>
      {title && (
        <>
          <span
            style={{
              color: "var(--blog-text-secondary)",
              margin: "0 0.35em",
              fontSize: "0.85em",
              fontWeight: 400,
              opacity: showBreadcrumb ? 1 : 0,
              transition: "opacity 0.25s ease",
            }}
          >
            ›
          </span>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="font-serif truncate no-underline cursor-pointer"
            style={{
              color: "var(--blog-text)",
              fontSize: "0.85em",
              fontWeight: 500,
              lineHeight: 1,
              opacity: showBreadcrumb ? 1 : 0,
              transition: "opacity 0.25s ease",
            }}
          >
            {title}
          </a>
        </>
      )}
    </div>
  );
}
