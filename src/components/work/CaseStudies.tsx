import type { FC, ReactNode } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getShowcase } from "@/src/data/showcase";
import { CaseFigure } from "./CaseFigure";
import type { Project } from "@/types";

export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** View-transition names shared by a project's list entry and its case study. */
export const vtTitle = (slug: string) => `title-${slug}`;
export const vtFigure = (slug: string) => `figure-${slug}`;

/** Text that morphs between pages: the title grows into the case study's h1. */
export const MorphTitle: FC<{ slug: string; children: ReactNode }> = ({ slug, children }) => (
  <ViewTransition name={vtTitle(slug)} share="morph" default="none">
    <span className="vt-title">{children}</span>
  </ViewTransition>
);

export const ProjectLinks: FC<{ p: Project; withCaseStudy?: boolean }> = ({ p, withCaseStudy = true }) => (
  <div className="case__links">
    {withCaseStudy && (
      <Link
        href={`/projects/${p.slug}`}
        className="go"
        transitionTypes={["nav-forward"]}
      >
        <span>
          Read the <span className="sr-only">{p.title} </span>case study
        </span>
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    )}
    {p.demo && (
      <a
        href={p.demo}
        className="go"
        data-external
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${p.title} at ${hostOf(p.demo)} (opens in a new tab)`}
      >
        {hostOf(p.demo)}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    )}
    {p.github && (
      <a
        href={p.github}
        className="go"
        data-external
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${p.title} source on GitHub (opens in a new tab)`}
      >
        Source
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    )}
  </div>
);

/**
 * The large case studies: each project with the one thing worth looking at.
 * Title and picture carry view-transition names, so following the link
 * grows them into the case study page.
 */
export const CaseStudies: FC<{ projects: Project[]; headingLevel?: "h2" | "h3"; withPoints?: boolean }> = ({
  projects,
  headingLevel = "h3",
  withPoints = false,
}) => {
  const H = headingLevel;
  return (
    <ul className="cases">
      {projects.map((p, i) => {
        const show = getShowcase(p.slug);
        return (
          <li key={p.slug} className="case" data-reveal>
            <div className="case__text">
              <H className="case__title t-h2">
                <Link href={`/projects/${p.slug}`} transitionTypes={["nav-forward"]}>
                  <MorphTitle slug={p.slug}>{p.title}</MorphTitle>
                </Link>
              </H>
              <p className="measure">{p.description}</p>
              {withPoints && p.resume_points.length > 0 && (
                <ul className="case__points measure">
                  {p.resume_points.slice(0, 2).map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              )}
              {p.lang && <p className="case__stack">{p.lang.join(" · ")}</p>}
              <ProjectLinks p={p} />
            </div>
            {show && (
              <div className="case__figure">
                <CaseFigure show={show} repo={p.github} priority={i === 0} transitionName={vtFigure(p.slug)} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
