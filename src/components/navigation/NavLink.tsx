"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/lib/navigation-config";

interface NavLinkProps extends NavItem {}

export function NavLink({ label, href }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`
        relative px-3 py-2 text-sm font-medium rounded-md
        transition-colors duration-200
        ${
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }
      `}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground rounded-full" />
      )}
    </Link>
  );
}
