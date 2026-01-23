import { LandingHero } from "@/components/landing/LandingHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "张天明",
};

export default function Home() {
  return <LandingHero />;
}
