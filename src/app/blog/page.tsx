import { getAllPosts } from "@/lib/blog/posts";
import { PostCard } from "@/components/blog/post-card";

export const metadata = {
  title: "Blog",
  description: "All posts",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-[38.75rem] px-6 py-16">
      <div className="mt-10 space-y-10">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
