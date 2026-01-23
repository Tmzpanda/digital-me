import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, savePost, deletePost } from "@/lib/blog";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const data = await request.json();

  try {
    savePost(slug, {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      date: data.date,
      published: data.published,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  const deleted = deletePost(slug);

  if (!deleted) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
