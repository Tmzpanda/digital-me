"use client";

import { useState, useEffect, use } from "react";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { BlogPost } from "@/lib/blog-types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function EditPostPage({ params }: Props) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/blog/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data.post);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-6 h-6 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Post not found
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">Edit Post</h1>
      <BlogEditor
        initialData={{
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          date: post.date,
          published: post.published,
        }}
        isEditing
      />
    </div>
  );
}
