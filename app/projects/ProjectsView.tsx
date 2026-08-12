"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GithubIcon, ExternalLink, ChevronRight, X } from "lucide-react";
import projectsData, { projectsMeta } from "@/src/data/projects";
import categories from "@/src/data/projectCategories";
import { IconBadge } from "@/src/components/IconBadge";
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
    if (filter === "All") return true;
    return [...p.tags, ...(p.lang ?? [])]
      .map((tag) => tag.toLowerCase())
      .includes(filter.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-brand-border pb-8">
        <div>
          <h1 className="text-4xl font-mono font-bold tracking-tighter uppercase">
            {projectsMeta.main_heading}
          </h1>
          <p className="text-brand-muted mt-2 font-mono text-[10px] uppercase tracking-widest">
            {projectsMeta.sub_heading}
          </p>
        </div>

        <div className="mt-8 md:mt-0 flex flex-wrap gap-2 border border-brand-border p-1 bg-brand-surface overflow-x-auto">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
               className={`px-3 py-1 md:px-4 md:py-1.5 font-mono text-[9px] uppercase whitespace-nowrap transition-all ${

                filter === cat
                  ? "bg-brand-accent text-brand-bg font-bold"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Active tag filter (set by clicking a language/framework tag) */}
      {filter !== "All" && !isCategoryFilter && (
        <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
          <span className="text-brand-muted">FILTER_ACTIVE:</span>
          <button
            onClick={() => setFilter("All")}
            className="flex items-center gap-2 border border-brand-accent/50 bg-brand-accent/10 text-brand-accent px-3 py-1 hover:bg-brand-accent hover:text-brand-bg transition-all"
          >
            <span>{filter}</span>
            <X size={10} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="group bg-brand-bg border border-brand-border p-12 relative flex flex-col hover:bg-brand-surface transition-colors"
          >
            <span className="absolute top-4 left-4 text-[9px] font-mono text-brand-muted border border-brand-border px-2 py-0.5 bg-brand-bg">
  UID: {String(p.id).padStart(2, "0")}
</span>
            <div className="absolute top-4 right-4 font-mono text-[7px] opacity-10 uppercase tracking-[0.2em]">
              Hash::SHA256
            </div>

            <div className="flex items-center space-x-4 mb-8">
              <IconBadge icon={p.icon} />

              <div>
                {/* Title clickable to GitHub */}
                {p.github ? (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-semibold font-mono hover:underline"
                  >
                    {p.title.toUpperCase()}
                  </a>
                ) : (
                  <h3 className="text-2xl font-bold font-mono">{p.title}</h3>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {p.tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilter(t)}
                      className="text-[8px] font-mono bg-brand-text text-brand-bg border border-brand-text px-2 py-0.5 uppercase transition-all hover:bg-brand-accent hover:border-brand-accent cursor-pointer"
                      title={`Show ${t} projects`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-brand-muted leading-relaxed mb-6 flex-grow font-sans">
              {p.description}
            </p>

            {/* Language / framework tags */}
            {p.lang && p.lang.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {p.lang.map((l) => (
                  <button
                    key={l}
                    onClick={() => setFilter(l)}
                    className="text-[9px] font-mono text-brand-muted border border-brand-border px-2.5 py-1 transition-all hover:border-brand-accent/60 hover:text-brand-accent hover:bg-brand-accent/10 cursor-pointer"
                    title={`Show ${l} projects`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-brand-border pt-8">
              <Link
                href={`/projects/${p.slug}`}
                className="flex items-center text-[10px] font-mono text-brand-accent hover:underline tracking-widest"
              >
                [DEEP_INSPECT] <ChevronRight size={12} className="ml-1" />
              </Link>

              <div className="flex space-x-5 text-brand-muted">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-accent"
                  >
                    <GithubIcon size={20} />
                  </a>
                )}
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-accent"
                  >
                    <ExternalLink size={20} />
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
