export type BlogCategory = "tech" | "investment" | "worldview" | "people";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  date: string;
  readingTime: string;
  published: boolean;
  coverImage?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  readingTime: string;
  published: boolean;
  coverImage?: string;
}

export const categoryLabels: Record<BlogCategory, string> = {
  tech: "科技",
  investment: "投资",
  worldview: "世界观",
  people: "人",
};
