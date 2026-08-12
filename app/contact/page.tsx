"use client";

import { useState } from "react";
import { Mail, GithubIcon, LinkedinIcon, PenSquare, Copy, Check } from "lucide-react";
import { Reveal } from "@/src/components/Reveal";
import socialData from "@/src/data/social";

const EMAIL = socialData.email;

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

const CHANNELS = [
  {
    label: "GITHUB",
    value: stripProtocol(socialData.github),
    href: socialData.github,
    icon: GithubIcon,
  },
  {
    label: "LINKEDIN",
    value: stripProtocol(socialData.linkedin),
    href: socialData.linkedin,
    icon: LinkedinIcon,
  },
  {
    label: "BLOG",
    value: stripProtocol(socialData.blog),
    href: socialData.blog,
    icon: PenSquare,
  },
];

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — the mailto link still works as a fallback.
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <header className="mb-16 border-b border-brand-border pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 rounded-full bg-brand-accent status-pulse" />
          <span className="font-mono text-[10px] text-brand-accent uppercase tracking-widest">
            CHANNEL_OPEN
          </span>
        </div>
        <h1 className="text-4xl font-mono font-bold tracking-tighter uppercase">
          CONTACT // ESTABLISH_LINK
        </h1>
        <p className="text-brand-muted mt-2 font-mono text-[10px] uppercase tracking-widest">
          Reach out for collaborations, roles, or just to talk shop.
        </p>
      </header>

      <Reveal>
        <div className="bg-brand-surface border border-brand-border p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[9px] text-brand-muted uppercase tracking-widest mb-2">
              PRIMARY_CHANNEL
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="text-xl md:text-2xl font-mono font-bold text-brand-text hover:text-brand-accent transition-colors break-all"
            >
              {EMAIL}
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 bg-brand-accent text-brand-bg px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-brand-muted transition-all"
            >
              <Mail size={14} />
              <span>SEND_MAIL</span>
            </a>
            <button
              onClick={copyEmail}
              className="flex items-center gap-2 border border-brand-border text-brand-muted px-4 py-3 font-mono text-[10px] uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-all"
              aria-label="Copy email address"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "COPIED" : "COPY"}</span>
            </button>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHANNELS.map((c, i) => (
          <Reveal key={c.label} delay={0.05 * (i + 1)}>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-brand-bg border border-brand-border p-8 hover:bg-brand-surface hover:border-brand-accent/40 transition-all h-full"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 border border-brand-accent/30 bg-brand-accent/10 text-brand-accent mb-6">
                <c.icon size={18} />
              </span>
              <p className="font-mono text-[9px] text-brand-muted uppercase tracking-widest mb-2">
                {c.label}
              </p>
              <p className="font-mono text-sm text-brand-text group-hover:text-brand-accent transition-colors break-all">
                {c.value}
              </p>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-8 border border-brand-border p-8 bg-brand-bg font-mono text-xs text-brand-muted">
          <span className="text-brand-accent">{">"}</span> status: open to backend,
          security, and infrastructure roles — response time typically under 48h.
        </div>
      </Reveal>
    </div>
  );
}
