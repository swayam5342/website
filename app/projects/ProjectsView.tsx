"use client";

import type React from "react";
import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";
import projectsData, { getProjectIcon } from "@/src/data/projects";
import categories from "@/src/data/projectCategories";
import { IconBadge } from "@/src/components/IconBadge";
import { MorphTitle, hostOf } from "@/src/components/work/CaseStudies";
import type { Project } from "@/types";

const tagsOf = (p: Project) => [...p.tags, ...(p.lang ?? [])].map((t) => t.toLowerCase());

/** Matches the old behaviour: "All" hides projects marked show:false; a tag shows every project carrying it. */
const matches = (p: Project, filter: string) =>
  filter === "All" ? p.show !== false : tagsOf(p).includes(filter.toLowerCase());

interface ProjectsViewProps {
  indexHeading: string;
}

interface IndexProps extends ProjectsViewProps {
  filter: string;
  setFilter: (tag: string) => void;
  indexRef?: React.Ref<HTMLElement>;
}

function ProjectsContent({ indexHeading }: ProjectsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("tag") ?? "All";
  // Keep the canonical spelling of a known category whatever the URL's case.
  const filter = categories.find((c) => c.toLowerCase() === raw.toLowerCase()) ?? raw;
  const indexRef = useRef<HTMLElement>(null);

  const setFilter = (tag: string) => {
    router.replace(tag === "All" ? "/projects" : `/projects?tag=${encodeURIComponent(tag)}`, { scroll: false });
  };

  // Arriving from a tag or skill link: bring the results into view.
  useEffect(() => {
    if (raw !== "All") indexRef.current?.scrollIntoView({ block: "start" });
    // Only on first load, so later filter clicks do not jump the page.
  }, []);

  // The case studies are rendered by the server above this list; a filter
  // hides them (CSS on html[data-filtered]) so only the matches show.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-filtered", filter !== "All");
    return () => document.documentElement.removeAttribute("data-filtered");
  }, [filter]);

  return <ProjectIndex indexHeading={indexHeading} filter={filter} setFilter={setFilter} indexRef={indexRef} />;
}

/** The compact, filterable index. Pure: the server renders it unfiltered as the fallback. */
function ProjectIndex({ indexHeading, filter, setFilter, indexRef }: IndexProps) {
  const all = projectsData as Project[];
  const filtered = all.filter((p) => matches(p, filter));
  // With no filter, the index lists everything that is not already a case study above.
  const indexed = filter === "All" ? filtered.filter((p) => typeof p.spotlight !== "number") : filtered;
  const isCategory = categories.includes(filter);
  const countFor = (c: string) => all.filter((p) => matches(p, c)).length;

  return (
    <>
      <section ref={indexRef} className="section" aria-labelledby="index-heading" style={{ scrollMarginTop: "5rem" }}>
        <div className="index-head">
          <h2 id="index-heading" className="t-h2">
            {filter === "All" ? indexHeading : `Projects tagged ${filter}`}
          </h2>
          <p className="muted" aria-live="polite">
            {filter === "All"
              ? `${indexed.length} more, besides the ${all.filter((p) => typeof p.spotlight === "number").length} case studies above. The filters cover every project, including the small ones made for fun.`
              : `${indexed.length} ${indexed.length === 1 ? "project" : "projects"}`}
          </p>
        </div>

        <div className="filters" role="group" aria-label="Filter projects by topic">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
              <span className="chip__count tabular">{countFor(c)}</span>
            </button>
          ))}
          {!isCategory && filter !== "All" && (
            <button type="button" className="chip" aria-pressed onClick={() => setFilter("All")}>
              {filter}
              <X size={14} aria-hidden="true" />
              <span className="sr-only">Clear the filter</span>
            </button>
          )}
        </div>

        <ul className="index">
          {indexed.map((p) => (
            <li key={p.slug} className="index__row">
              <h3 className="index__title">
                <IconBadge icon={getProjectIcon(p)} />
                <Link href={`/projects/${p.slug}`} transitionTypes={["nav-forward"]}>
                  {/* The case studies above stay mounted (hidden) under a filter and
                      already own their titles' transition names: a name may only be
                      mounted once, so only the other projects claim theirs here. */}
                  {typeof p.spotlight === "number" ? p.title : <MorphTitle slug={p.slug}>{p.title}</MorphTitle>}
                </Link>
              </h3>
              <div className="index__body">
                <p>{p.description}</p>
                {p.lang && p.lang.length > 0 && (
                  <p className="index__tags">
                    {p.lang.map((l) => (
                      <button
                        key={l}
                        type="button"
                        className="tag-link"
                        onClick={() => setFilter(l)}
                        aria-label={`Show projects using ${l}`}
                      >
                        {l}
                      </button>
                    ))}
                  </p>
                )}
              </div>
              <div className="index__links">
                {p.demo && (
                  <a href={p.demo} className="go t-small" data-external target="_blank" rel="noopener noreferrer" aria-label={`${p.title} at ${hostOf(p.demo)} (opens in a new tab)`}>
                    {hostOf(p.demo)}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
                {p.github && (
                  <a href={p.github} className="go t-small" data-external target="_blank" rel="noopener noreferrer" aria-label={`${p.title} source on GitHub (opens in a new tab)`}>
                    Source
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        {indexed.length === 0 && (
          <p>
            Nothing is tagged {filter} yet.{" "}
            <button type="button" className="tag-link" onClick={() => setFilter("All")}>
              Show everything
            </button>
          </p>
        )}
      </section>
    </>
  );
}

export default function ProjectsView(props: ProjectsViewProps) {
  return (
    <Suspense fallback={<ProjectIndex {...props} filter="All" setFilter={() => {}} />}>
      <ProjectsContent {...props} />
    </Suspense>
  );
}
