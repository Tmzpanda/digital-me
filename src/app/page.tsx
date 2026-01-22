import { LandingHero } from "@/components/landing/LandingHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "天色渐明",
};

export default function Home() {
  return <LandingHero />;
}
