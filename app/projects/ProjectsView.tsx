"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GithubIcon, ExternalLink, ArrowUpRight, X } from "lucide-react";
import projectsData, { projectsMeta, getProjectIcon } from "@/src/data/projects";
import categories from "@/src/data/projectCategories";
import { IconBadge } from "@/src/components/IconBadge";
import { PageHeader } from "@/src/components/PageHeader";
import type { Project } from "@/types";

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("tag") ?? "All";

  const setFilter = (tag: string) => {
    if (tag === "All") {
      router.replace("/projects");
    } else {
      router.replace(`/projects?tag=${encodeURIComponent(tag)}`);
    }
  };

  const isCategoryFilter = categories.some(
    (c) => c.toLowerCase() === filter.toLowerCase()
  );

  const filteredProjects = (projectsData as Project[]).filter((p) => {
    if (filter === "All") return p.show !== false;
    return [...p.tags, ...(p.lang ?? [])]
      .map((tag) => tag.toLowerCase())
      .includes(filter.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <PageHeader
        eyebrow={projectsMeta.sub_heading}
        title={projectsMeta.main_heading}
        aside={
          <div className="flex flex-wrap gap-2 md:max-w-sm md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`chip cursor-pointer whitespace-nowrap ${
                  filter === cat
                    ? "!border-brand-text !bg-brand-text !text-brand-bg"
                    : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        }
      />

      {/* Active tag filter (set by clicking a language/framework tag) */}
      {filter !== "All" && !isCategoryFilter && (
        <div className="mb-8 flex items-center gap-3 text-sm">
          <span className="text-brand-muted">Filtering by</span>
          <button
            onClick={() => setFilter("All")}
            className="chip chip-accent cursor-pointer gap-2"
          >
            <span>{filter}</span>
            <X size={12} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <div key={p.id} className="card flex flex-col p-8 md:p-10">
            <div className="flex items-start justify-between mb-12">
              <IconBadge icon={getProjectIcon(p)} />
              <span className="eyebrow">{String(p.id).padStart(2, "0")}</span>
            </div>

            {/* Title clickable to GitHub */}
            {p.github ? (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="display text-3xl md:text-4xl hover:text-brand-accent transition-colors"
              >
                {p.title}
              </a>
            ) : (
              <h3 className="display text-3xl md:text-4xl">{p.title}</h3>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {p.tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className="chip chip-accent cursor-pointer"
                  title={`Show ${t} projects`}
                >
                  {t}
                </button>
              ))}
            </div>

            <p className="mt-6 mb-6 flex-grow text-sm leading-relaxed text-brand-muted">
              {p.description}
            </p>

            {/* Language / framework tags */}
            {p.lang && p.lang.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {p.lang.map((l) => (
                  <button
                    key={l}
                    onClick={() => setFilter(l)}
                    className="chip cursor-pointer"
                    title={`Show ${l} projects`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-brand-border pt-6">
              <Link
                href={`/projects/${p.slug}`}
                className="group flex items-center gap-1 text-sm text-brand-text"
              >
                Read case study
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <div className="flex space-x-4 text-brand-muted">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Repository"
                    className="hover:text-brand-text transition-colors"
                  >
                    <GithubIcon size={18} />
                  </a>
                )}
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Live demo"
                    className="hover:text-brand-text transition-colors"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsView() {
  return (
    <Suspense fallback={null}>
      <ProjectsContent />
    </Suspense>
  );
}
