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
    label: "Work",
    href: "/work",
    description: "Chat with my AI about my professional experience",
  },
  {
    label: "Life",
    href: "/life",
    description: "Beyond the code",
  },
];
