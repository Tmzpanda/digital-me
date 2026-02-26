import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Artifacts",
  description: "Products, films, and investments",
};

export default function ArtifactsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Artifacts</h1>
      <p className="text-muted-foreground mb-8">Coming soon.</p>
      <Link
        href="/"
        className="text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors"
      >
        ← Back
      </Link>
    </div>
  );
}
