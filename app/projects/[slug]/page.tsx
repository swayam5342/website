import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GithubIcon, Globe, ShieldCheck, AlertCircle, RefreshCw, Layers } from "lucide-react";
import projectsData from "@/src/data/projects";
import { IconBadge } from "@/src/components/IconBadge";
import type { Project } from "@/types";

export function generateStaticParams() {
  return (projectsData as Project[]).map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (projectsData as Project[]).find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/projects" className="inline-flex items-center space-x-2 text-brand-muted hover:text-brand-accent transition-colors mb-8 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Projects</span>
      </Link>

      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(t => (
            <Link
              key={t}
              href={`/projects?tag=${encodeURIComponent(t)}`}
              title={`Show ${t} projects`}
              className="text-xs font-mono uppercase px-3 py-1 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent transition-all hover:bg-brand-accent hover:text-brand-bg"
            >
              {t}
            </Link>
          ))}
          {project.lang?.map(l => (
            <Link
              key={l}
              href={`/projects?tag=${encodeURIComponent(l)}`}
              title={`Show ${l} projects`}
              className="text-xs font-mono px-3 py-1 rounded border border-brand-border text-brand-muted transition-all hover:border-brand-accent/60 hover:text-brand-accent hover:bg-brand-accent/10"
            >
              {l}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <IconBadge icon={project.icon} size={22} />
          <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
        </div>
        <p className="text-xl text-brand-muted leading-relaxed">{project.description}</p>

        <div className="flex items-center space-x-4 mt-8">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-brand-surface border border-white/10 px-5 py-2.5 rounded-lg font-bold hover:border-brand-accent/50 transition-all">
              <GithubIcon size={18} />
              <span>Repository</span>
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-brand-accent text-brand-bg px-5 py-2.5 rounded-lg font-bold hover:scale-[1.02] transition-all">
              <Globe size={18} />
              <span>Live System</span>
            </a>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {project.details && (<>
          <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <Layers className="text-brand-accent" />
            <span>Architecture Overview</span>
          </h2>
          <div className="p-6 bg-brand-surface rounded-2xl border border-white/5 text-brand-muted leading-relaxed">
            {project.details?.architecture}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <AlertCircle className="text-brand-accent" />
            <span>Key Challenges</span>
          </h2>
          <div className="p-6 bg-brand-surface rounded-2xl border border-white/5 text-brand-muted leading-relaxed">
            {project.details?.challenges}
          </div>
        </section>

        <section className="relative overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <ShieldCheck className="text-brand-accent" />
            <span>Security Considerations</span>
          </h2>
          <div className="p-6 bg-brand-accent/5 rounded-2xl border border-brand-accent/20 text-brand-muted leading-relaxed backdrop-blur-sm">
            {project.details?.security}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <RefreshCw className="text-brand-accent" />
            <span>Future Improvements</span>
          </h2>
          <div className="p-6 bg-brand-surface rounded-2xl border border-white/5 text-brand-muted leading-relaxed">
            {project.details?.improvements}
          </div>
        </section>
        </>)
        }

        <section>
          <h2 className="text-2xl font-bold mb-6">Technical Impact</h2>
          <ul className="space-y-4">
            {project.resume_points.map((point, i) => (
              <li key={i} className="flex items-start space-x-3 text-brand-muted">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
