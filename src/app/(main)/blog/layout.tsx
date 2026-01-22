import { Metadata } from "next";

export const metadata: Metadata = {
  title: "天色渐明",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
