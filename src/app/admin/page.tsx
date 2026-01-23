import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/blog"
          className="p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <h2 className="text-lg font-semibold text-foreground mb-2">Blog</h2>
          <p className="text-sm text-muted-foreground">
            Manage your blog posts
          </p>
        </Link>
      </div>
    </div>
  );
}
