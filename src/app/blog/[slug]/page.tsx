import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { format } from "date-fns";
import { getPostBySlug, getPostSlugs } from "@/lib/blog/posts";
import { mdxComponents } from "@/components/blog/mdx-components";
import { TableOfContents, TableOfContentsMobile } from "@/components/blog/table-of-contents";

interface Heading {
  depth: number;
  text: string;
  id: string;
}

function extractHeadings(raw: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  for (const line of raw.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = match[2].replace(/[*_`~\[\]]/g, "").trim();
      headings.push({ depth: match[1].length, text, id: slugger.slug(text) });
    }
  }
  return headings;
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    try {
      const { meta } = getPostBySlug(slug);
      return { title: meta.title, description: meta.description };
    } catch {
      return { title: "Not Found" };
    }
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const headings = extractHeadings(post.content);

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  return (
    <>
      <TableOfContents headings={headings} />
      <TableOfContentsMobile headings={headings} />

      <article className="mx-auto w-full max-w-[38.75rem] px-6" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <header>
          <h1 className="font-serif font-bold leading-[1.1]" style={{ fontSize: "3.1em", marginBottom: "0.2em", textWrap: "balance" }}>
            {post.meta.title}
          </h1>
          {post.meta.description && (
            <p style={{ fontSize: "1.1em", fontStyle: "italic" }}>
              {post.meta.description}
            </p>
          )}
          <p style={{ fontSize: "0.9em", color: "var(--blog-text-secondary)", marginTop: "2em", marginBottom: "1em" }}>
            {format(new Date(post.meta.date), "MMMM yyyy")}
          </p>
        </header>

        <div className="prose max-w-none">
          {content}
        </div>
      </article>
    </>
  );
}
