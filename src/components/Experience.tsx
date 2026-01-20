"use client";

import { ArrowUpRight } from "lucide-react";

interface ExperienceItem {
  title: string;
  company: string;
  companyUrl?: string;
  period: string;
  description: string;
  skills?: string[];
}

interface ExperienceProps {
  items?: ExperienceItem[];
}

const defaultExperience: ExperienceItem[] = [
  {
    title: "Data Engineer",
    company: "Meta",
    companyUrl: "https://about.meta.com/realitylabs/",
    period: "Jun 2024 — Present",
    description:
      "Working in Reality Labs - Metaverse division. Designing and building scalable data solutions to optimize growth, strategy and user experience.",
    skills: ["Data Engineering", "Scalable Systems", "Analytics"],
  },
  {
    title: "Senior Data Engineer",
    company: "Twelve",
    companyUrl: "https://www.twelve.co/",
    period: "Apr 2023 — May 2024",
    description:
      "Built an enterprise data platform that integrates data from multiple systems to a central data warehouse, serving as a single source of truth for organization-wide data reporting.",
    skills: ["GCP", "Data Modeling", "Data Warehouse"],
  },
  {
    title: "Data Engineer",
    company: "StackPath",
    companyUrl: "https://www.stackpath.com/",
    period: "Jan 2022 — Feb 2023",
    description:
      "Built a cloud-native log streaming platform as a service, with a control plane for orchestrating pipelines and a data plane for processing.",
    skills: ["Kafka", "gRPC", "Cloud Native"],
  },
  {
    title: "Software Engineer",
    company: "Baanyan Software Services",
    companyUrl: "https://www.baanyan.com/",
    period: "Sep 2020 — Jan 2022",
    description:
      "Migrated and optimized ETL workloads from on-premise Hadoop cluster to Databricks Lakehouse.",
    skills: ["Spark", "Airflow", "Databricks"],
  },
];

export function Experience({ items = defaultExperience }: ExperienceProps) {
  return (
    <section id="experience" className="scroll-mt-24">
      <h2 className="section-heading">Experience</h2>
      <div className="card-list space-y-2">
        {items.map((item, index) => {
          const CardWrapper = item.companyUrl ? "a" : "div";
          const cardProps = item.companyUrl
            ? {
                href: item.companyUrl,
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
              <div className="relative grid sm:grid-cols-[120px_1fr] gap-4">
                <span className="text-xs text-muted-foreground/70 font-medium pt-1 uppercase tracking-wide">
                  {item.period}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug flex items-center gap-1">
                    {item.title}
                    <span className="text-muted-foreground font-normal">
                      {" "}· {item.company}
                    </span>
                    <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-0.5 transition-all duration-200" />
                  </h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {item.skills && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <span key={skill} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardWrapper>
          );
        })}
      </div>
    </section>
  );
}
