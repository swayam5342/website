"use client";

import { useState } from "react";
import { Mail, GithubIcon, LinkedinIcon, PenSquare, Copy, Check } from "lucide-react";
import { PageHeader } from "@/src/components/PageHeader";
import { Reveal } from "@/src/components/Reveal";
import socialData from "@/src/data/social";

const EMAIL = socialData.email;

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

const CHANNELS = [
  {
    label: "GitHub",
    value: stripProtocol(socialData.github),
    href: socialData.github,
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    value: stripProtocol(socialData.linkedin),
    href: socialData.linkedin,
    icon: LinkedinIcon,
  },
  {
    label: "Blog",
    value: stripProtocol(socialData.blog),
    href: socialData.blog,
    icon: PenSquare,
  },
];

export default function ContactView() {
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
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <PageHeader
        eyebrow="Open to work"
        title={
          <>
            Let&apos;s <em>talk.</em>
          </>
        }
        description="Reach out for collaborations, roles, or just to talk shop."
      />

      <Reveal>
        <div className="card p-8 md:p-10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="eyebrow mb-3">Email</p>
            <a
              href={`mailto:${EMAIL}`}
              className="display text-3xl md:text-4xl hover:text-brand-accent transition-colors break-all"
            >
              {EMAIL}
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href={`mailto:${EMAIL}`} className="btn btn-solid">
              <Mail size={14} />
              <span>Send mail</span>
            </a>
            <button
              onClick={copyEmail}
              className="btn btn-ghost cursor-pointer"
              aria-label="Copy email address"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
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
              className="group card block h-full p-8"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 border border-brand-border text-brand-text mb-8">
                <c.icon size={18} />
              </span>
              <p className="eyebrow mb-2">{c.label}</p>
              <p className="text-sm text-brand-text group-hover:text-brand-accent transition-colors break-all">
                {c.value}
              </p>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-10 flex items-center gap-3 text-sm text-brand-muted">
          <span className="status-pulse inline-block w-1.5 h-1.5 bg-brand-accent" />
          Open to backend, security, and infrastructure roles — response time
          typically under 48h.
        </p>
      </Reveal>
    </div>
  );
}
