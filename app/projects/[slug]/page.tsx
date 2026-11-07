import type { Metadata } from "next";
import siteData from "@/src/data/site";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import projectsData from "@/src/data/projects";
import { getShowcase } from "@/src/data/showcase";
import { CaseFigure } from "@/src/components/work/CaseFigure";
import { MorphTitle, ProjectLinks, vtFigure } from "@/src/components/work/CaseStudies";
import { PageTransition } from "@/src/components/PageTransition";
import type { Project } from "@/types";

export function generateStaticParams() {
  return (projectsData as Project[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = (projectsData as Project[]).find((p) => p.slug === slug);
  if (!project) return {};

  const description = trimDescription(project.description);
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      images: [{ url: siteData.ogImage }],
      title: project.title,
      description,
      url: `/projects/${project.slug}`,
    },
  };
}

/** Search results show about 155 characters: cut at a word and mark the cut. */
const trimDescription = (text: string, max = 155) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
};

/** The detail sections, in reading order, with plain headings. */
const SECTIONS: { key: keyof NonNullable<Project["details"]>; heading: string }[] = [
  { key: "architecture", heading: "How it is built" },
  { key: "challenges", heading: "The hard part" },
  { key: "security", heading: "Security" },
  { key: "improvements", heading: "What comes next" },
];

const spotlight = (projectsData as Project[])
  .filter((p) => typeof p.spotlight === "number")
  .sort((a, b) => a.spotlight! - b.spotlight!);

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = (projectsData as Project[]).find((p) => p.slug === slug);
  if (!project) notFound();

  const show = getShowcase(project.slug);
  const i = spotlight.findIndex((p) => p.slug === project.slug);
  const next = i >= 0 ? spotlight[(i + 1) % spotlight.length] : undefined;
  const extras = show?.also?.map((extra, n) => (
    <div key={`extra-${n}`} className="study__extra" data-reveal>
      <CaseFigure show={extra} repo={project.github} />
    </div>
  ));

  return (
    <PageTransition>
      <article className="frame study">
        <p className="study__back">
          <Link href="/projects" className="go" transitionTypes={["nav-back"]}>
            <ArrowLeft size={16} aria-hidden="true" />
            All projects
          </Link>
        </p>

        <header className="study__head">
          <h1 className="t-display study__title">
            <MorphTitle slug={project.slug}>{project.title}</MorphTitle>
          </h1>
          <div className="study__intro">
            <p className="t-lead">{project.description}</p>
            <dl className="study__facts">
              {project.lang && project.lang.length > 0 && (
                <div>
                  <dt>Built with</dt>
                  <dd>
                    {project.lang.map((l, n) => (
                      <span key={l}>
                        {n > 0 && ", "}
                        <Link className="link" href={`/projects?tag=${encodeURIComponent(l)}`}>
                          {l}
                        </Link>
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt>Topics</dt>
                <dd>
                  {project.tags.map((t, n) => (
                    <span key={t}>
                      {n > 0 && ", "}
                      <Link className="link" href={`/projects?tag=${encodeURIComponent(t)}`}>
                        {t}
                      </Link>
                    </span>
                  ))}
                </dd>
              </div>
              {project.date && (
                <div>
                  <dt>When</dt>
                  <dd>{project.date}</dd>
                </div>
              )}
            </dl>
            <ProjectLinks p={project} withCaseStudy={false} />
          </div>
        </header>

        {show && (
          <div className="study__figure">
            <CaseFigure show={show} repo={project.github} priority quality={90} transitionName={vtFigure(project.slug)} />
          </div>
        )}

        <div className="study__body">
          {project.details &&
            SECTIONS.map(({ key, heading }) => (
              <Fragment key={key}>
                <section className="study__section" data-reveal aria-labelledby={`s-${key}`}>
                  <h2 id={`s-${key}`} className="t-h2">
                    {heading}
                  </h2>
                  <p className="measure">{project.details![key]}</p>
                </section>
                {/* Extra figures sit with the architecture they show. */}
                {key === "architecture" && extras}
              </Fragment>
            ))}
          {!project.details && extras}

          {project.resume_points.length > 0 && (
            <section className="study__section" data-reveal aria-labelledby="s-did">
              <h2 id="s-did" className="t-h2">
                What I did
              </h2>
              <ul className="did measure">
                {project.resume_points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {next && next.slug !== project.slug && (
          <nav className="study__next" aria-label="Next case study">
            <span className="muted">Next case study</span>
            <Link href={`/projects/${next.slug}`} className="study__next-link" transitionTypes={["nav-forward"]}>
              <MorphTitle slug={next.slug}>{next.title}</MorphTitle>
              <ArrowRight size={28} aria-hidden="true" />
            </Link>
          </nav>
        )}
      </article>
    </PageTransition>
  );
}
