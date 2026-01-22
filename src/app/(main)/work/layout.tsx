import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with Tim",
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
