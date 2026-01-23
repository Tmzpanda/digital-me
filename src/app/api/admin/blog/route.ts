import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, savePost } from "@/lib/blog";

export async function GET() {
  const posts = getAllPosts(true); // Include unpublished
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  try {
    savePost(slug, {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      date: data.date || new Date().toISOString().split("T")[0],
      published: data.published ?? false,
    });

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save post" },
      { status: 500 }
    );
  }
}
