import React from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import projectsData from "../data/projects";
import homeData from "../data/home.json";
import experiencesData from "../data/experiences.json";
import timelineData from "../data/timeline";
import { HeroTerminal } from "../components/home/HeroTerminal";
import { IconBadge } from "../components/IconBadge";
import { Reveal } from "../components/Reveal";
import type { Experience } from "../../types";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuredProjects = projectsData
    .filter((p) => p.featured)
    .slice(0, 2);

  const main_text = homeData.main_text;

  const recentExperiences = (experiencesData as Experience[]).slice(0, 2);
  const recentTimeline = timelineData.slice(0, 2);

  return (
    <div className="relative">
      {/* Background: blueprint grid fading from the top, one soft accent glow */}
      <div className="absolute inset-x-0 top-0 h-[90vh] -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-blueprint opacity-40" />
        <div className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-2xl max-h-2xl bg-brand-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-28">

        {/* Hero */}
        <section className="min-h-[75vh] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div className="space-y-8">
            <div
              className="anim-rise font-mono text-[10px] text-brand-muted flex items-center space-x-2 tracking-widest uppercase"
              style={{ "--rise-delay": "0s" } as React.CSSProperties}
            >
              <span className="status-pulse inline-block w-1.5 h-1.5 bg-brand-accent"></span>
              <span>{homeData.main_heading}</span>
            </div>

            <h1
              className="anim-rise text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]"
              style={{ "--rise-delay": "0.1s" } as React.CSSProperties}
            >
              Secure <br />
              Backend <br />
              <span className="text-brand-muted/25 hover:text-brand-accent transition-colors duration-500 cursor-default">
                Architect
              </span>
            </h1>

            <p
              className="anim-rise max-w-lg text-brand-muted text-base leading-relaxed border-l-2 border-brand-accent/40 pl-6"
              style={{ "--rise-delay": "0.22s" } as React.CSSProperties}
            >
              {main_text}
            </p>

            <div
              className="anim-rise flex flex-wrap gap-4 pt-4"
              style={{ "--rise-delay": "0.34s" } as React.CSSProperties}
            >
              <Link
                to="/projects"
                className="group border border-brand-accent bg-brand-accent text-brand-bg px-8 py-3 font-mono text-xs font-bold flex items-center space-x-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-8px_var(--brand-accent)]"
              >
                <span>{homeData.project}</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/certificates"
                className="border border-brand-border px-8 py-3 font-mono text-xs font-bold flex items-center space-x-3 transition-all duration-300 hover:border-brand-accent/60 hover:text-brand-accent hover:-translate-y-0.5"
              >
                <span>CERTIFICATES</span>
              </Link>
            </div>
          </div>

          <div
            className="anim-rise hidden lg:block"
            style={{ "--rise-delay": "0.3s" } as React.CSSProperties}
          >
            <HeroTerminal />
          </div>
        </section>

      {/* Recent Experience / Timeline */}
      <section className="space-y-12">
        <Reveal>
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <h2 className="font-mono text-[10px] font-bold tracking-widest text-brand-muted">
              RECENT_ACTIVITY.LOG
            </h2>
            <Link
              to="/about"
              className="text-brand-accent text-[9px] font-mono hover:underline"
            >
              FULL_HISTORY
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentExperiences.length > 0
            ? recentExperiences.map((exp, i) => (
                <Reveal key={exp.id} delay={i * 0.12}>
                  <div className="h-full p-8 border border-brand-border bg-brand-surface transition-all duration-300 group hover:border-brand-accent/50 hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_var(--brand-accent)]">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-mono font-bold text-brand-text mb-2 group-hover:text-brand-accent transition-colors duration-300">
                          {exp.title}
                        </h3>
                        <p className="text-brand-accent font-mono text-sm mb-4">
                          {exp.company}
                        </p>
                      </div>

                      <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                        <div className="font-mono text-[10px] text-brand-muted border border-brand-border px-3 py-1 bg-brand-bg">
                          {exp.period}
                        </div>

                        <div className="font-mono text-[9px] text-brand-accent uppercase tracking-widest border border-brand-accent/50 px-2 py-0.5 bg-brand-accent/10">
                          {exp.type.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <p className="text-brand-muted text-sm leading-relaxed mb-6 font-sans line-clamp-3">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="bg-brand-accent/10 text-brand-accent px-2 py-1 text-xs font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))
            : recentTimeline.map((item, i) => (
                <Reveal key={`${item.title}-${item.date}`} delay={i * 0.12}>
                  <div className="h-full bg-brand-surface/50 border border-brand-border p-6 md:p-8 transition-all duration-300 hover:border-brand-accent/50 hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold font-mono uppercase text-brand-text tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-[11px] font-mono text-brand-accent uppercase tracking-widest mt-1 opacity-80">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="mt-2 md:mt-0 flex flex-col items-end space-y-2">
                        <div className="font-mono text-[10px] text-brand-muted border border-brand-border px-3 py-1 bg-brand-bg">
                          {item.date}
                        </div>

                        <div className="font-mono text-[9px] text-brand-accent uppercase tracking-widest border border-brand-accent/50 px-2 py-0.5 bg-brand-accent/10">
                          {item.type.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-brand-muted leading-relaxed font-mono opacity-80">
                      {`> ${item.description}`}
                    </p>
                  </div>
                </Reveal>
              ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-12">
        <Reveal>
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <h2 className="font-mono text-[10px] font-bold tracking-widest text-brand-muted">
              LATEST_DEPLOYS.LOG
            </h2>

            <Link
              to="/projects"
              className="text-brand-accent text-[9px] font-mono hover:underline"
            >
              EXTRACT_ALL_DATA
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProjects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.12}>
              <Link
                to={`/projects/${p.slug}`}
                className="group relative block h-full border border-brand-border p-10 md:p-12 bg-brand-surface overflow-hidden transition-all duration-300 hover:border-brand-accent/50 hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_var(--brand-accent)]"
              >
                {/* Accent line that grows across the top on hover */}
                <span className="absolute top-0 left-0 h-0.5 w-0 bg-brand-accent transition-all duration-500 group-hover:w-full" />

                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-3">
                    <IconBadge icon={p.icon} />
                    <span className="text-[9px] font-mono text-brand-muted border border-brand-border px-2 py-0.5">
                      UID: {String(p.id).padStart(2, "0")}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/projects?tag=${encodeURIComponent(p.tags[0])}`);
                    }}
                    title={`Show ${p.tags[0]} projects`}
                    className="text-[9px] font-mono text-brand-accent uppercase tracking-widest border border-brand-accent/40 bg-brand-accent/10 px-2 py-0.5 transition-all hover:bg-brand-accent hover:text-brand-bg cursor-pointer"
                  >
                    {p.tags[0]}
                  </button>
                </div>

                <h3 className="text-3xl font-bold mb-4 font-mono tracking-tight transition-colors duration-300 group-hover:text-brand-accent">
                  {p.title}
                </h3>

                <p className="text-brand-muted text-sm leading-relaxed mb-10 line-clamp-2 font-sans">
                  {p.description}
                </p>

                <div className="flex items-center text-[10px] font-mono text-brand-accent">
                  <span>VIEW_TECHNICAL_DEBT</span>
                  <ArrowRight
                    size={12}
                    className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
};