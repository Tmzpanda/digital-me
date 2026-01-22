import { LandingHero } from "@/components/landing/LandingHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tianming Zhang",
};

export default function Home() {
  return <LandingHero />;
}
