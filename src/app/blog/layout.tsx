import { BlogThemeProvider } from "@/components/blog/blog-theme-provider";
import { TocProvider } from "@/components/blog/toc-context";
import { BlogHeader } from "@/components/blog/blog-header";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlogThemeProvider>
      <TocProvider>
        <BlogHeader />
        <main>{children}</main>
      </TocProvider>
    </BlogThemeProvider>
  );
}
