import React from "react";
import skillsjson from "../data/skill.json";
import aboutjson from "../data/about.json";

export const AboutPage: React.FC = () => {
  const skills = skillsjson as {
    cyber: string[];
    backend: string[];
    core: string[];
  };

  const main_text = aboutjson.main_text;
  const sub_text = aboutjson.sub_text;
  const securityPrinciples = aboutjson.security_principles as string[];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <header className="border-b border-brand-border pb-8">
        <h1 className="text-4xl font-mono font-bold tracking-tighter">About</h1>
        <p className="text-brand-muted mt-2 font-mono text-[10px] tracking-widest uppercase">
          ID_IDENTIFIER: SWAYAM
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* LEFT CONTENT */}
        <div className="md:col-span-8 space-y-8 text-brand-muted leading-relaxed font-sans">
          
          <div className="bg-brand-surface border border-brand-border p-10 relative">
            <div className="absolute top-0 right-0 p-3 font-mono text-[8px] text-brand-muted/20 uppercase">
              Core_Data_Stream
            </div>

            <p className="text-brand-text mb-6 text-lg font-medium leading-snug">
              {main_text}
            </p>

            <p className="text-sm">{sub_text}</p>
          </div>

          {/* OPERATING PRINCIPLES */}
          <div className="border border-brand-border p-8 bg-brand-bg">
            <h3 className="font-mono text-[10px] font-bold text-brand-muted uppercase border-b border-brand-border pb-2 mb-6">
              OPERATING_PRINCIPLES
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

          {/* Cyber Security */}
          <div className="space-y-4">
            <h4 className="font-mono text-[9px] text-brand-accent uppercase tracking-widest mb-4">
              Cyber_Security
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
              Backend_Infra
            </h4>

            <div className="flex flex-wrap gap-2">
              {skills.backend.map((s) => (
                <span
                  key={s}
                  className="bg-brand-surface border border-brand-border px-3 py-1.5 text-xs font-mono text-brand-text"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Runtime */}
          <div className="space-y-4">
            <h4 className="font-mono text-[9px] text-brand-accent uppercase tracking-widest mb-4">
              Runtime_Env
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

        </div>
      </div>
    </div>
  );
};
