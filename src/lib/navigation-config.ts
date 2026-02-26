export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const navItems: NavItem[] = [
  {
    label: "Blog",
    href: "/blog",
    description: "Thoughts and writings",
  },
  {
    label: "Artifacts",
    href: "/artifacts",
    description: "Things I've built",
  },
  {
    label: "Team",
    href: "/team",
    description: "Meet my AI agents",
  },
  {
    label: "Work",
    href: "/work",
    description: "Chat with my AI about my professional experience",
  },
];
