import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { BlogPost, BlogPostMeta, BlogCategory } from "./blog-types";

export * from "./blog-types";

const contentDirectory = path.join(process.cwd(), "content/blog");

export function getAllPosts(includeUnpublished = false): BlogPostMeta[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory);
  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(contentDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        category: data.category || "tech",
        date: data.date || new Date().toISOString().split("T")[0],
        readingTime: readingTime(content).text,
        published: data.published !== false,
        coverImage: data.coverImage,
      } as BlogPostMeta;
    })
    .filter((post) => includeUnpublished || post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "Untitled",
    excerpt: data.excerpt || "",
    content,
    category: data.category || "tech",
    date: data.date || new Date().toISOString().split("T")[0],
    readingTime: readingTime(content).text,
    published: data.published !== false,
    coverImage: data.coverImage,
  };
}

export function getPostsByCategory(category: BlogCategory): BlogPostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function savePost(slug: string, post: Partial<BlogPost>): void {
  if (!fs.existsSync(contentDirectory)) {
    fs.mkdirSync(contentDirectory, { recursive: true });
  }

  const fullPath = path.join(contentDirectory, `${slug}.mdx`);

  const frontmatter = {
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: post.date,
    published: post.published,
    coverImage: post.coverImage,
  };

  const content = `---
title: "${frontmatter.title}"
excerpt: "${frontmatter.excerpt}"
category: "${frontmatter.category}"
date: "${frontmatter.date}"
published: ${frontmatter.published}
${frontmatter.coverImage ? `coverImage: "${frontmatter.coverImage}"` : ""}
---

${post.content || ""}
`;

  fs.writeFileSync(fullPath, content, "utf8");
}

export function deletePost(slug: string): boolean {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return false;
  }

  fs.unlinkSync(fullPath);
  return true;
}
