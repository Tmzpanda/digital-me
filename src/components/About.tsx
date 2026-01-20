"use client";

interface AboutProps {
  bio?: string;
}

export function About({
  bio = "I'm a passionate software engineer with a love for building innovative solutions. I specialize in full-stack development and AI applications. Feel free to chat with my AI assistant below to learn more about me!",
}: AboutProps) {
  return (
    <section className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="text-center">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
          About
        </h2>
        <p className="text-lg text-foreground/80 leading-relaxed">
          {bio}
        </p>
      </div>
    </section>
  );
}
