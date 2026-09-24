"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import skillsjson from "@/src/data/skill";
import aboutjson from "@/src/data/about";
import timelineData from "@/src/data/timeline";
import { TimelineIcon } from "@/src/components/TimelineIcon";
import { PageHeader } from "@/src/components/PageHeader";
import { SectionHeader } from "@/src/components/SectionHeader";
import { THEMES } from "@/src/hooks/useTheme";

const GITHUB_CARD_BASE =
  "https://raw.githubusercontent.com/swayam5342/swayam5342/main";
const GITHUB_CARD_SOURCE_COLORS: Record<
  "light" | "dark",
  { bg: string; accent: string; text: string; key: string; value: string; cc: string }
> = {
  dark: {
    bg: "#161b22",
    accent: "#7aa2f7",
    text: "#c9d1d9",
    key: "#ffa657",
    value: "#a5d6ff",
    cc: "#616e7f",
  },
  light: {
    bg: "#f6f8fa",
    accent: "#0969da",
    text: "#24292f",
    key: "#953800",
    value: "#0a3069",
    cc: "#c2cfde",
  },
};

export default function AboutView() {
  const skills = skillsjson;
  const backendSkills = [
    ...skills.backend,
    ...skills.database,
    ...skills.devops,
  ];
  const main_text = aboutjson.main_text;
  const sub_text = aboutjson.sub_text;
  const securityPrinciples = aboutjson.security_principles;
  const [photoMissing, setPhotoMissing] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState<string>("dark");
  useEffect(() => {
    const root = document.documentElement;
    const readTheme = () => {
      const attr = root.getAttribute("data-theme");
      return attr && THEMES.some((t) => t.id === attr) ? attr : "dark";
    };
    setActiveThemeId(readTheme());

    const observer = new MutationObserver(() => setActiveThemeId(readTheme()));
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const themeMode = THEMES.find((t) => t.id === activeThemeId)?.mode ?? "dark";
  const githubCardSrc = `${GITHUB_CARD_BASE}/${themeMode === "light" ? "light" : "dark"}_mode.svg`;
  const [githubCardSvg, setGithubCardSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(githubCardSrc)
      .then((res) => res.text())
      .then((svg) => {
        if (cancelled) return;
        const root = getComputedStyle(document.documentElement);
        const brand = (name: string) => root.getPropertyValue(name).trim();
        const source = GITHUB_CARD_SOURCE_COLORS[themeMode];

        let recolored = svg
          .replaceAll(source.bg, brand("--brand-bg"))
          .replaceAll(source.accent, brand("--brand-accent"))
          .replaceAll(source.text, brand("--brand-text"))
          .replaceAll(source.key, brand("--brand-accent"))
          .replaceAll(source.value, brand("--brand-text"))
          .replaceAll(source.cc, brand("--brand-muted"))
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/\son\w+="[^"]*"/gi, "");

        if (!/viewBox=/.test(recolored)) {
          recolored = recolored.replace(
            /<svg /,
            '<svg viewBox="0 0 1040 530" '
          );
        }

        setGithubCardSvg(recolored);
      })
      .catch(() => setGithubCardSvg(null));

    return () => {
      cancelled = true;
    };
  }, [githubCardSrc, themeMode, activeThemeId]);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 space-y-28">
      <PageHeader
        eyebrow={aboutjson.heading}
        title="About"
        aside={
          <div className="shrink-0 self-start md:self-end">
            {photoMissing ? (
              <div className="w-36 h-36 md:w-44 md:h-44 border border-brand-border bg-brand-surface flex items-center justify-center eyebrow text-center p-4">
                No photo
              </div>
            ) : (
              <Image
                src={aboutjson.photo}
                alt={`Portrait of ${aboutjson.name}`}
                onError={() => setPhotoMissing(true)}
                width={176}
                height={176}
                priority
                className="w-36 h-36 md:w-44 md:h-44 object-cover border border-brand-border bg-brand-surface grayscale hover:grayscale-0 transition-all duration-500"
              />
            )}
          </div>
        }
      />

      <div className="-mt-12 flex flex-wrap gap-2">
        {aboutjson.roles.map((role) => (
          <span key={role} className="chip chip-accent">
            {role}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
        {/* LEFT CONTENT */}
        <div className="md:col-span-7 space-y-14">
          <div className="space-y-6">
            <p className="display text-3xl md:text-4xl leading-[1.15]">
              {main_text}
            </p>
            <p className="text-brand-muted leading-relaxed">{sub_text}</p>
          </div>

          {/* OPERATING PRINCIPLES */}
          <div>
            <p className="eyebrow mb-2">Principles</p>
            <ul className="divide-y divide-brand-border border-y border-brand-border">
              {securityPrinciples.map((principle, index) => (
                <li key={index} className="flex items-start gap-6 py-5">
                  <span className="eyebrow pt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT SKILLS */}
        <div className="md:col-span-5 space-y-10">
          <div className="space-y-4">
            <h4 className="eyebrow">Main</h4>
            <div className="flex flex-wrap gap-2">
              {skills.core.map((s) => (
                <span
                  key={s}
                  className="chip !border-brand-text !bg-brand-text !text-brand-bg"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="eyebrow">Cyber</h4>
            <div className="flex flex-wrap gap-2">
              {skills.cyber.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="eyebrow">Backend</h4>
            <div className="flex flex-wrap gap-2">
              {backendSkills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experience Timeline */}
      <section className="space-y-4">
        <SectionHeader index="01" title="Experience" />

        {timelineData.length === 0 && (
          <p className="py-10 text-sm text-brand-muted">No records yet.</p>
        )}

        <div className="divide-y divide-brand-border">
          {timelineData.map((item) => (
            <article
              key={item.id}
              className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-10"
            >
              <div className="md:col-span-3 space-y-2">
                <p className="eyebrow">{item.date}</p>
                <p className="flex items-center gap-2 text-sm text-brand-muted transition-colors group-hover:text-brand-text">
                  <TimelineIcon category={item.type} />
                  <span>{item.type}</span>
                </p>
              </div>

              <div className="md:col-span-9 space-y-3">
                <div>
                  <h3 className="display text-3xl">{item.title}</h3>
                  <p className="mt-1 text-brand-accent">{item.subtitle}</p>
                </div>
                <p className="max-w-2xl leading-relaxed text-brand-muted">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* GitHub Activity */}
      <section className="space-y-8">
        <SectionHeader index="02" title="GitHub activity" />

        <div className="card p-4 overflow-x-auto">
          {githubCardSvg ? (
            <div
              role="img"
              aria-label="Swayam's GitHub Dashboard"
              className="w-full max-w-[1040px] mx-auto [&_svg]:w-full [&_svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: githubCardSvg }}
            />
          ) : (
            <img
              src={githubCardSrc}
              alt="Swayam's GitHub Dashboard"
              className="w-full max-w-[1040px] mx-auto"
            />
          )}
        </div>
      </section>
    </div>
  );
}
