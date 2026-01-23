import { getPostBySlug, getAllPosts, categoryLabels } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { MDXContent } from "@/components/blog/MDXContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center h-12">
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            {categoryLabels[post.category]}
          </span>
          <span className="text-sm text-muted-foreground">{post.date}</span>
          <span className="text-sm text-muted-foreground">· {post.readingTime}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
          {post.title}
        </h1>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXContent content={post.content} />
        </div>
      </article>
    </div>
  );
}
