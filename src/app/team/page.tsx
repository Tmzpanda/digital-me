import { Metadata } from "next";
import { OrgChart } from "@/components/team/OrgChart";

export const metadata: Metadata = {
  title: "Agent Team",
  description: "Meet my AI agent team — an org chart of autonomous agents handling tech, investment, content, and personal assistance.",
};

export default function TeamPage() {
  return <OrgChart />;
}
