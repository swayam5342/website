import type { Metadata } from "next";
import Link from "next/link";
import skillsjson from "@/src/data/skill";
import projectsData from "@/src/data/projects";
import { IconBadge } from "@/src/components/IconBadge";
import { PageHeader } from "@/src/components/PageHeader";
import { Reveal } from "@/src/components/Reveal";
import type { Project } from "@/types";

const description = "Languages, frameworks, and security tooling in active use.";

export const metadata: Metadata = {
  title: "Skills",
  description,
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "Skills",
    description,
    url: "/skills",
  },
};

const SKILL_GROUPS: { label: string; icon: string; skills: string[] }[] = [
  { label: "Core languages", icon: "code", skills: skillsjson.core },
  { label: "Backend & APIs", icon: "server", skills: skillsjson.backend },
  { label: "Databases", icon: "database", skills: skillsjson.database },
  { label: "DevOps & infra", icon: "container", skills: skillsjson.devops },
  { label: "Cybersecurity", icon: "shield-check", skills: skillsjson.cyber },
];

/** Lowercased set of every tag and language across all projects,
 *  so skill pills only link to the projects filter when it has results. */
const PROJECT_TAGS = new Set(
  (projectsData as Project[]).flatMap((p) =>
    [...p.tags, ...(p.lang ?? [])].map((t) => t.toLowerCase())
  )
);

export default function Skills() {
  const totalModules = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <PageHeader
        eyebrow={`${totalModules} skills in use`}
        title="Skills"
        description={description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_GROUPS.map((group, i) => (
          <Reveal key={group.label} delay={(i % 3) * 0.1}>
            <div className="card h-full p-8">
              <div className="flex items-center space-x-4 mb-8">
                <IconBadge icon={group.icon} />
                <div>
                  <h2 className="display text-2xl">{group.label}</h2>
                  <p className="eyebrow mt-1">
                    {String(group.skills.length).padStart(2, "0")} items
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) =>
                  PROJECT_TAGS.has(skill.toLowerCase()) ? (
                    <Link
                      key={skill}
                      href={`/projects?tag=${encodeURIComponent(skill)}`}
                      title={`Show ${skill} projects`}
                      className="chip chip-accent"
                    >
                      {skill}
                    </Link>
                  ) : (
                    <span key={skill} className="chip cursor-default">
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-12 text-sm text-brand-muted">
        Highlighted skills link to related projects.
      </p>
    </div>
  );
}
