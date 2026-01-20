"use client";

import { ArrowUpRight, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
}

interface ProjectsProps {
  items?: Project[];
}

const defaultProjects: Project[] = [
  {
    title: "Digital Me",
    description:
      "A personal website with an AI-powered chatbot that can answer questions about my professional background. Built with Next.js, Tailwind CSS, and Claude API.",
    tech: ["Next.js", "TypeScript", "Claude API", "Tailwind CSS"],
    github: "https://github.com/tmzpanda/digital-me",
  },
  // Add more projects here
];

export function Projects({ items = defaultProjects }: ProjectsProps) {
  return (
    <section id="projects" className="scroll-mt-24">
      <h2 className="section-heading">Projects</h2>
      <div className="card-list space-y-2">
        {items.map((project, index) => {
          const projectUrl = project.link || project.github;
          const CardWrapper = projectUrl ? "a" : "div";
          const cardProps = projectUrl
            ? {
                href: projectUrl,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {};

          return (
            <CardWrapper
              key={index}
              {...cardProps}
              className="group interactive-card p-5 -mx-5 block cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-1">
                  {project.title}
                  <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-0.5 transition-all duration-200" />
                </h3>
                {project.github && project.link && (
                  <div
                    className="flex gap-3 shrink-0 relative z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="skill-tag">
                    {t}
                  </span>
                ))}
              </div>
            </CardWrapper>
          );
        })}
      </div>
    </section>
  );
}
