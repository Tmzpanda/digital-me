import { Metadata } from "next";

export const metadata: Metadata = {
  title: "It is about the Journey:)",
};

export default function LifeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
