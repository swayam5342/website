import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GithubIcon, Globe } from "lucide-react";
import projectsData, { getProjectIcon } from "@/src/data/projects";
import { IconBadge } from "@/src/components/IconBadge";
import type { Project } from "@/types";

export function generateStaticParams() {
  return (projectsData as Project[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (projectsData as Project[]).find((p) => p.slug === slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (projectsData as Project[]).find((p) => p.slug === slug);

  if (!project) notFound();

  const sections = project.details
    ? [
        { index: "01", title: "Architecture", body: project.details.architecture },
        { index: "02", title: "Key challenges", body: project.details.challenges },
        { index: "03", title: "Security considerations", body: project.details.security },
        { index: "04", title: "Future improvements", body: project.details.improvements },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
      <Link
        href="/projects"
        className="group mb-12 inline-flex items-center gap-2 text-sm text-brand-muted transition-colors hover:text-brand-text"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>All projects</span>
      </Link>

      <header className="mb-20 border-b border-brand-border pb-14">
        <div className="mb-8 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <Link
              key={t}
              href={`/projects?tag=${encodeURIComponent(t)}`}
              title={`Show ${t} projects`}
              className="chip chip-accent"
            >
              {t}
            </Link>
          ))}
          {project.lang?.map((l) => (
            <Link
              key={l}
              href={`/projects?tag=${encodeURIComponent(l)}`}
              title={`Show ${l} projects`}
              className="chip"
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="mb-6 flex items-center gap-5">
          <IconBadge icon={getProjectIcon(project)} size={22} />
          <h1 className="display text-5xl md:text-7xl">{project.title}</h1>
        </div>
        <p className="max-w-2xl text-xl leading-relaxed text-brand-muted">
          {project.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <GithubIcon size={16} />
              <span>Repository</span>
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
              <Globe size={16} />
              <span>Live system</span>
            </a>
          )}
        </div>
      </header>

      <div className="space-y-16">
        {sections.map((s) => (
          <section
            key={s.index}
            className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-10"
          >
            <div className="md:col-span-4">
              <p className="eyebrow mb-2">{s.index}</p>
              <h2 className="display text-3xl">{s.title}</h2>
            </div>
            <p className="leading-relaxed text-brand-muted md:col-span-8">
              {s.body}
            </p>
          </section>
        ))}

        <section className="grid grid-cols-1 gap-4 border-t border-brand-border pt-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <h2 className="display text-3xl">Technical impact</h2>
          </div>
          <ul className="space-y-4 md:col-span-8">
            {project.resume_points.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-brand-muted">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-brand-accent" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
