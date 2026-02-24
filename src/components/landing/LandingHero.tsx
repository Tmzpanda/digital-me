import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/lib/navigation-config";

const personalInfo = {
  name: "Tianming Zhang",
  chineseName: "张天明",
  profileImage: "/images/profile.jpg",
};

export function LandingHero() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Profile Photo */}
        <Link href="/" className="avatar-glow relative mb-12 inline-block group">
          <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-border/50 shadow-soft-lg ring-4 ring-background transition-transform duration-200 group-hover:scale-105">
            <Image
              src={personalInfo.profileImage}
              alt={personalInfo.name}
              width={320}
              height={320}
              quality={95}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </Link>

        {/* Navigation Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200 hover:shadow-soft"
            >
              <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.label}
                <span className="inline-block ml-1 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
