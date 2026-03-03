import { ThemeToggle } from "./theme-toggle";
import { TocToggle } from "./toc-toggle";
import { HeaderTitle } from "./breadcrumb";
import { getAllPosts } from "@/lib/blog/posts";

export function BlogHeader() {
  const posts = getAllPosts();
  const titles: Record<string, string> = {};
  for (const p of posts) {
    titles[p.slug] = p.title;
  }

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "var(--blog-bg)" }}>
      <div className="mx-auto flex max-w-[38.75rem] items-center justify-between px-6 py-3">
        <HeaderTitle titles={titles} />
        <div className="flex items-center gap-3 shrink-0">
          <TocToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
