import Link from "next/link";
import { format } from "date-fns";
import { PostMeta } from "@/lib/blog/types";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group block">
        <h2 className="font-serif text-xl font-semibold group-hover:opacity-70 transition-opacity">
          {post.title}
        </h2>
        <time className="mt-1 block text-sm" style={{ color: "var(--blog-text-secondary)" }}>
          {format(new Date(post.date), "MMMM yyyy")}
        </time>
        <p className="mt-2" style={{ color: "var(--blog-text-secondary)" }}>
          {post.description}
        </p>
      </Link>
    </article>
  );
}
