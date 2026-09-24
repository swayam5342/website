"use client";

import type React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import projectsData from "@/src/data/projects";
import homeData from "@/src/data/home";
import experiencesData from "@/src/data/experiences";
import timelineData from "@/src/data/timeline";
import { HeroTerminal } from "@/src/components/home/HeroTerminal";
import { IconBadge } from "@/src/components/IconBadge";
import { Reveal } from "@/src/components/Reveal";
import { SectionHeader } from "@/src/components/SectionHeader";

export default function Home() {
  const router = useRouter();
  const featuredProjects = projectsData
    .filter((p) => p.featured)
    .slice(0, 2);

  const main_text = homeData.main_text;

  const recentExperiences = experiencesData.slice(0, 2);
  const recentTimeline = timelineData.slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 space-y-32">
      {/* Hero */}
      <section className="pt-8 md:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
        <div className="lg:col-span-7 space-y-10">
          <p
            className="anim-rise eyebrow flex items-center gap-3"
            style={{ "--rise-delay": "0s" } as React.CSSProperties}
          >
            <span className="status-pulse inline-block w-1.5 h-1.5 bg-brand-accent" />
            {homeData.main_heading}
          </p>

          <h1
            className="anim-rise display text-6xl md:text-8xl"
            style={{ "--rise-delay": "0.1s" } as React.CSSProperties}
          >
            Secure backend <em>architect.</em>
          </h1>

          <p
            className="anim-rise max-w-lg text-brand-muted text-lg leading-relaxed"
            style={{ "--rise-delay": "0.22s" } as React.CSSProperties}
          >
            {main_text}
          </p>

          <div
            className="anim-rise flex flex-wrap gap-3"
            style={{ "--rise-delay": "0.34s" } as React.CSSProperties}
          >
            <Link href="/projects" className="group btn btn-solid">
              <span>{homeData.project}</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link href="/certificates" className="btn btn-ghost">
              Certificates
            </Link>
          </div>
        </div>

        <div
          className="anim-rise hidden lg:block lg:col-span-5"
          style={{ "--rise-delay": "0.3s" } as React.CSSProperties}
        >
          <HeroTerminal />
        </div>
      </section>

      {/* Recent Experience / Timeline */}
      <section className="space-y-4">
        <Reveal>
          <SectionHeader
            index="01"
            title="Recent activity"
            href="/about"
            linkLabel="Full history"
          />
        </Reveal>

        <div className="divide-y divide-brand-border">
          {recentExperiences.length > 0
            ? recentExperiences.map((exp, i) => (
                <Reveal key={exp.id} delay={i * 0.12}>
                  <article className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-10">
                    <div className="md:col-span-3 space-y-2">
                      <p className="eyebrow">{exp.period}</p>
                      <p className="text-sm text-brand-muted">{exp.type}</p>
                    </div>

                    <div className="md:col-span-9 space-y-5">
                      <div>
                        <h3 className="display text-3xl">{exp.title}</h3>
                        <p className="mt-1 text-brand-accent">{exp.company}</p>
                      </div>

                      <p className="max-w-2xl text-brand-muted leading-relaxed line-clamp-3">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {exp.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="chip">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))
            : recentTimeline.map((item, i) => (
                <Reveal key={`${item.title}-${item.date}`} delay={i * 0.12}>
                  <article className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-10">
                    <div className="md:col-span-3 space-y-2">
                      <p className="eyebrow">{item.date}</p>
                      <p className="text-sm text-brand-muted">{item.type}</p>
                    </div>

                    <div className="md:col-span-9 space-y-3">
                      <div>
                        <h3 className="display text-3xl">{item.title}</h3>
                        <p className="mt-1 text-brand-accent">{item.subtitle}</p>
                      </div>
                      <p className="max-w-2xl text-brand-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-10">
        <Reveal>
          <SectionHeader
            index="02"
            title="Selected work"
            href="/projects"
            linkLabel="All projects"
          />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredProjects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.12}>
              <Link
                href={`/projects/${p.slug}`}
                className="group card flex h-full flex-col p-8 md:p-10"
              >
                <div className="flex justify-between items-start mb-16">
                  <IconBadge icon={p.icon} />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/projects?tag=${encodeURIComponent(p.tags[0])}`);
                    }}
                    title={`Show ${p.tags[0]} projects`}
                    className="chip cursor-pointer"
                  >
                    {p.tags[0]}
                  </button>
                </div>

                <h3 className="display text-4xl md:text-5xl mb-4">{p.title}</h3>

                <p className="text-brand-muted leading-relaxed mb-10 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-auto flex items-center text-sm text-brand-text">
                  <span>View case study</span>
                  <ArrowRight
                    size={14}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
