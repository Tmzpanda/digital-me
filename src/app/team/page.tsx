import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-foreground mb-4">Team</h1>
        <p className="text-muted-foreground mb-8">
          My agent team.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Coming soon
        </div>
      </div>
    </div>
  );
}
