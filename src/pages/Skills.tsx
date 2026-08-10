import React from "react";
import { Link } from "react-router-dom";
import skillsjson from "../data/skill";
import projectsData from "../data/projects";
import { IconBadge } from "../components/IconBadge";
import { Reveal } from "../components/Reveal";
import type { Project } from "../../types";

const SKILL_GROUPS: { label: string; icon: string; skills: string[] }[] = [
  { label: "CORE_LANGUAGES", icon: "code", skills: skillsjson.core },
  { label: "BACKEND_&_APIS", icon: "server", skills: skillsjson.backend },
  { label: "DATABASES", icon: "database", skills: skillsjson.database },
  { label: "DEVOPS_&_INFRA", icon: "container", skills: skillsjson.devops },
  { label: "CYBERSECURITY", icon: "shield-check", skills: skillsjson.cyber },
];

/** Lowercased set of every tag and language across all projects,
 *  so skill pills only link to the projects filter when it has results. */
const PROJECT_TAGS = new Set(
  (projectsData as Project[]).flatMap((p) =>
    [...p.tags, ...(p.lang ?? [])].map((t) => t.toLowerCase())
  )
);

export const Skills: React.FC = () => {
  const totalModules = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <header className="mb-16 border-b border-brand-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-mono font-bold tracking-tighter uppercase">
            SKILLS // CAPABILITY_MATRIX
          </h1>
          <p className="text-brand-muted mt-2 font-mono text-[10px] uppercase tracking-widest">
            Languages, frameworks, and security tooling in active use.
          </p>
        </div>
        <span className="font-mono text-[9px] text-brand-muted uppercase tracking-widest">
          {totalModules}_MODULES_LOADED
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_GROUPS.map((group, i) => (
          <Reveal key={group.label} delay={(i % 3) * 0.1}>
            <div className="h-full border border-brand-border bg-brand-surface/50 p-8 transition-all duration-300 hover:border-brand-accent/40 hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-8">
                <IconBadge icon={group.icon} />
                <div>
                  <h2 className="font-mono text-sm font-bold tracking-widest text-brand-text">
                    {group.label}
                  </h2>
                  <p className="font-mono text-[9px] text-brand-muted uppercase tracking-widest mt-1">
                    {String(group.skills.length).padStart(2, "0")}_MODULES
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) =>
                  PROJECT_TAGS.has(skill.toLowerCase()) ? (
                    <Link
                      key={skill}
                      to={`/projects?tag=${encodeURIComponent(skill)}`}
                      title={`Show ${skill} projects`}
                      className="border border-brand-accent/40 bg-brand-accent/10 text-brand-accent px-3 py-1.5 text-xs font-mono transition-all duration-200 hover:bg-brand-accent hover:text-brand-bg hover:-translate-y-0.5"
                    >
                      {skill}
                    </Link>
                  ) : (
                    <span
                      key={skill}
                      className="border border-brand-border px-3 py-1.5 text-xs font-mono text-brand-muted transition-all duration-200 cursor-default hover:border-brand-accent/60 hover:text-brand-accent"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-12 font-mono text-[9px] text-brand-muted uppercase tracking-widest">
        Highlighted modules link to related projects.
      </p>
    </div>
  );
};
