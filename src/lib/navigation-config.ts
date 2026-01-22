export interface NavItem {
  label: string;
  href: string;
  description?: string;
  published?: boolean;
}

export const navItems: NavItem[] = [
  {
    label: "Blog",
    href: "/blog",
    description: "Thoughts and writings",
    published: false,
  },
  {
    label: "Work",
    href: "/work",
    description: "Chat with my AI about my professional experience",
    published: true,
  },
  {
    label: "Life",
    href: "/life",
    description: "Beyond the code",
    published: false,
  },
];
