"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  items: NavItem[];
}

export function Navigation({ items }: NavigationProps) {
  const sectionIds = items.map((item) => item.href.replace("#", ""));
  const activeSection = useActiveSection(sectionIds);

  return (
    <nav className="hidden lg:block mb-10">
      <ul className="space-y-4">
        {items.map((item) => {
          const sectionId = item.href.replace("#", "");
          const isActive = activeSection === sectionId;

          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "group flex items-center gap-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-px transition-all duration-300",
                    isActive
                      ? "w-16 bg-foreground"
                      : "w-8 bg-muted-foreground/30 group-hover:w-16 group-hover:bg-foreground"
                  )}
                />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
