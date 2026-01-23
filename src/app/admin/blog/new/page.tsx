import { BlogEditor } from "@/components/admin/BlogEditor";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">New Post</h1>
      <BlogEditor />
    </div>
  );
}
