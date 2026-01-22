"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/navigation-config";
import { NavLink } from "./NavLink";

export function TopNavigation() {
  const pathname = usePathname();

  // Only show the current page's tab (hide unpublished pages from navigation)
  const visibleItems = navItems.filter((item) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return isActive || item.published;
  });

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center h-14 gap-8">
          <Link
            href="/"
            className="text-foreground font-semibold hover:text-foreground/80 transition-colors shrink-0"
          >
            Tim Zhang
          </Link>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {visibleItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
