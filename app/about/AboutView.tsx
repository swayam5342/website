"use client";

import { useState } from "react";
import Image from "next/image";
import skillsjson from "@/src/data/skill";
import aboutjson from "@/src/data/about";
import timelineData from "@/src/data/timeline";
import { TimelineIcon } from "@/src/components/TimelineIcon";

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <header className="border-b border-brand-border pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-mono font-bold tracking-tighter">ABOUT</h1>
          <p className="text-brand-muted mt-2 font-mono text-[10px] tracking-widest uppercase">
            {aboutjson.heading}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {aboutjson.roles.map((role) => (
              <span
                key={role}
                className="font-mono text-[9px] uppercase tracking-widest text-brand-accent border border-brand-accent/40 bg-brand-accent/10 px-2.5 py-1"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Profile photo */}
        <div className="relative shrink-0 self-start md:self-end">
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-brand-accent" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-brand-accent" />
          {photoMissing ? (
            <div className="w-36 h-36 md:w-44 md:h-44 border border-brand-border bg-brand-surface flex flex-col items-center justify-center gap-2 font-mono text-[8px] text-brand-muted uppercase tracking-widest text-center p-4">
              <span className="text-brand-accent">[NO_SIGNAL]</span>
              <span>profile.png not found</span>
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
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* LEFT CONTENT */}
        <div className="md:col-span-8 space-y-8 text-brand-muted leading-relaxed font-sans">

          <div className="bg-brand-surface border border-brand-border p-10 relative">
            <div className="absolute top-0 right-0 p-3 font-mono text-[8px] text-brand-muted/20 uppercase text-white">
              CORE VALUES
            </div>

            <p className="text-brand-text mb-6 text-md font-(family-name:--font-space) leading-snug">
              {main_text}
            </p>

            <p className="text-sm">{sub_text}</p>
          </div>

          {/* OPERATING PRINCIPLES */}
          <div className="border border-brand-border p-8 bg-brand-bg">
            <h3 className="font-mono text-[10px] font-bold text-brand-muted uppercase border-b border-brand-border pb-2 mb-6">
              PRINCIPLES
            </h3>

            <ul className="space-y-6 text-xs font-mono">
              {securityPrinciples.map((principle, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <span className="bg-brand-accent text-brand-bg px-1 font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT SKILLS */}
        <div className="md:col-span-4 space-y-12">
          <div className="space-y-4">
            <h4 className="font-mono text-[9px] text-brand-accent uppercase tracking-widest mb-4">
              MAIN
            </h4>

            <div className="flex flex-wrap gap-2">
              {skills.core.map((s) => (
                <span
                  key={s}
                  className="bg-brand-accent text-brand-bg px-3 py-1.5 text-xs font-mono font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Cyber Security */}
          <div className="space-y-4">
            <h4 className="font-mono text-[9px] text-brand-accent uppercase tracking-widest mb-4">
              CYBER
            </h4>

            <div className="flex flex-wrap gap-2">
              {skills.cyber.map((s) => (
                <span
                  key={s}
                  className="bg-brand-surface border border-brand-border px-3 py-1.5 text-xs font-mono text-brand-text"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="space-y-4">
            <h4 className="font-mono text-[9px] text-brand-accent uppercase tracking-widest mb-4">
              BACKEND
            </h4>

            <div className="flex flex-wrap gap-2">
              {backendSkills.map((s) => (
                <span
                  key={s}
                  className="bg-brand-surface border border-brand-border px-3 py-1.5 text-xs font-mono text-brand-text"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>



        </div>
      </div>

      {/* Experience Timeline */}
<section className="space-y-12">
  <div className="flex items-center space-x-4">
    <h2 className="text-2xl font-mono font-bold tracking-tighter uppercase text-brand-accent">
      EXPERIENCE_JOURNAL
    </h2>
    <div className="flex-grow border-b border-brand-border opacity-20"></div>
    <span className="text-[10px] font-mono text-brand-muted uppercase">
      HISTORY_DUMP
    </span>
  </div>

  <div className="relative space-y-8 before:absolute before:left-[19px] md:before:left-[24px] before:top-11 before:h-[89%] before:w-[2px] before:bg-brand-border">

    {timelineData.length === 0 && (
      <p className="text-xs font-mono text-brand-muted">
        NO_RECORDS_FOUND
      </p>
    )}

    {timelineData.map((item) => (
      <div key={item.id} className="relative pl-12 md:pl-16 group">
        <div className="absolute left-0 top-1 w-10 md:w-12 h-10 md:h-12 bg-brand-bg border-2 border-brand-border flex items-center justify-center text-brand-muted group-hover:border-brand-accent group-hover:text-brand-accent transition-all duration-300 z-10">
          <TimelineIcon category={item.type} />
        </div>

        <div className="bg-brand-surface/50 border border-brand-border p-6 md:p-8 hover:border-brand-accent/30 transition-all">
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
      </div>
    ))}
  </div>
</section>

    </div>
  );
}
