import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import siteData from "@/src/data/site";
import aboutData from "@/src/data/about";
import skillData from "@/src/data/skill";
import certificatesData from "@/src/data/certificates";
import timelineData from "@/src/data/timeline";
import projectsData from "@/src/data/projects";
import socialData from "@/src/data/social";
import pdfPreviews from "@/src/data/pdf-previews.json";
import { PageTransition } from "@/src/components/PageTransition";
import { SkillMap, type SkillMapData } from "@/src/components/about/SkillMap";
import type { Project, SkillData } from "@/types";

const description =
  "About Swayam: a cybersecurity student at VIT Vellore and data science student at IIT Madras who builds APIs, sandboxes and detection pipelines.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    images: [{ url: siteData.ogImage }],
    title: "About",
    description,
    url: "/about",
  },
};

/** Plain names for the groups in skill.json. */
const SKILL_GROUPS: { key: keyof SkillData; label: string }[] = [
  { key: "core", label: "Languages" },
  { key: "backend", label: "Backend and APIs" },
  { key: "database", label: "Databases" },
  { key: "devops", label: "DevOps and infrastructure" },
  { key: "cyber", label: "Security" },
];

const projects = projectsData as Project[];

/** The projects whose tags or languages name this skill. */
const projectsUsing = (skill: string): Project[] =>
  projects.filter((p) => [...p.tags, ...(p.lang ?? [])].some((t) => t.toLowerCase() === skill.toLowerCase()));

/** Skills against projects, computed from skill.json and projects.json. */
const buildSkillMap = (): SkillMapData => {
  const unused: string[] = [];
  const groups = SKILL_GROUPS.map((g) => ({
    label: g.label,
    skills: skillData[g.key]
      .map((name) => ({ name, used: projectsUsing(name).map((p) => p.slug) }))
      .filter((s) => {
        if (s.used.length === 0) unused.push(s.name);
        return s.used.length > 0;
      }),
  })).filter((g) => g.skills.length > 0);

  const usedSlugs = new Set(groups.flatMap((g) => g.skills.flatMap((s) => s.used)));
  // Case studies first, in their order, then the rest in project order.
  const ordered = [
    ...projects.filter((p) => typeof p.spotlight === "number").sort((a, b) => a.spotlight! - b.spotlight!),
    ...projects.filter((p) => typeof p.spotlight !== "number"),
  ];
  return {
    projects: ordered.filter((p) => usedSlugs.has(p.slug)).map((p) => ({ slug: p.slug, title: p.title })),
    groups,
    unused,
  };
};

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
type Preview = { src: string; width: number; height: number };

export default function AboutPage() {
  const proofs = aboutData.principle_proofs ?? [];
  const skillMap = buildSkillMap();

  return (
    <PageTransition>
      <div className="frame">
        {/* Who I am */}
        <section className="about-intro" aria-labelledby="about-title">
          <div className="about-intro__text" data-reveal>
            <h1 id="about-title" className="t-display">
              {aboutData.heading}
            </h1>
            <p className="t-lead">{aboutData.main_text}</p>
            <p className="measure">{aboutData.sub_text}</p>
            <p className="muted">{aboutData.roles.join(" · ")}</p>
            <p>
              <a className="go" data-external href={socialData.blog} target="_blank" rel="noopener noreferrer">
                I write at {host(socialData.blog)}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </p>
          </div>
          <div className="about-intro__photo" data-reveal>
            <Image
              src={aboutData.photo}
              alt={`Portrait of ${aboutData.name}`}
              width={505}
              height={495}
              priority
              sizes="(min-width: 64rem) 28vw, 62vw"
            />
          </div>
        </section>

        {/* Three principles, each with proof from a project */}
        <section className="section" aria-labelledby="principles-title">
          <h2 id="principles-title" className="t-h2 section-title">
            How I work
          </h2>
          <ul className="principles" data-reveal>
            {aboutData.security_principles.map((principle, i) => {
              const proof = proofs[i];
              const project = proof && projects.find((p) => p.slug === proof.project);
              return (
                <li key={principle} className="principle-row">
                  <p className="principle">{principle}</p>
                  {proof && project && (
                    <div className="principle__proof">
                      <p>{proof.text}</p>
                      <Link href={`/projects/${project.slug}`} className="go t-small" transitionTypes={["nav-forward"]}>
                        <span>
                          See <span className="sr-only">the case study for </span>
                          {project.title}
                        </span>
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Skills against projects */}
        <section id="skills" className="section" aria-labelledby="skills-title">
          <div className="index-head">
            <h2 id="skills-title" className="t-h2">
              Skills
            </h2>
            <p className="measure">
              Each bar is how many of my projects use that skill, counted from the projects themselves. Select
              a skill to see them.
            </p>
          </div>
          <div data-reveal>
            <SkillMap data={skillMap} />
          </div>
        </section>

        {/* Education */}
        <section className="section" aria-labelledby="education-title">
          <h2 id="education-title" className="t-h2 section-title">
            Education
          </h2>
          <ul className="education" data-reveal>
            {[...timelineData].reverse().map((item) => (
              <li key={item.id} className="education__item">
                <p className="muted tabular">{item.date}</p>
                <h3 className="education__title">{item.title}</h3>
                <p className="education__school">{item.subtitle}</p>
                <p className="measure">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Certificates, shown as themselves */}
        <section id="certificates" className="section" aria-labelledby="certificates-title">
          <h2 id="certificates-title" className="t-h2 section-title">
            Certificates
          </h2>
          <ul className="certs" data-reveal>
            {certificatesData.map((c) => {
              const preview = (pdfPreviews as Record<string, Preview>)[c.file];
              const hasVerify = c.verify && c.verify.trim() !== "";
              return (
                <li key={c.slug} className="cert">
                  <Link href={`/certificates/${c.slug}`} className="cert__image" aria-hidden="true" tabIndex={-1}>
                    {preview && (
                      <Image src={preview.src} width={preview.width} height={preview.height} alt="" sizes="(min-width: 64rem) 22vw, 90vw" />
                    )}
                  </Link>
                  <h3 className="cert__name">
                    <Link href={`/certificates/${c.slug}`} className="quiet-link">
                      {c.name}
                    </Link>
                  </h3>
                  <p className="muted">
                    {c.issuer}, <span className="tabular">{c.year}</span>
                  </p>
                  {hasVerify && (
                    <a
                      href={c.verify}
                      className="go t-small"
                      data-external
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Verify ${c.name} with ${c.issuer} (opens in a new tab)`}
                    >
                      Verify
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </PageTransition>
  );
}
