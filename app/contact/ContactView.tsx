"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import socialData from "@/src/data/social";
import { FlockHero, FLOCK_SCATTER_EVENT } from "@/src/components/home/FlockHero";

const EMAIL = socialData.email;
const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const CHANNELS = [
  { label: "GitHub", href: socialData.github },
  { label: "LinkedIn", href: socialData.linkedin },
  { label: "Blog", href: socialData.blog },
];

/**
 * One screen: the address, set large, with the home page's flock behind it.
 * Copying the address scatters the flock; it gathers again by its own rules.
 */
export default function ContactView() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.dispatchEvent(new Event(FLOCK_SCATTER_EVENT));
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable: the mailto link still works.
    }
  };

  return (
    <FlockHero
      labelledBy="contact-title"
      showRules={false}
      className="hero--contact"
      readout={{ pause: "Pause the flock", play: "Play the flock" }}
    >
      <h1 id="contact-title" className="contact__title t-h2">
        Contact
      </h1>
      <p className="contact__big-wrap">
        <a href={`mailto:${EMAIL}`} className="contact__big">
          {EMAIL}
        </a>
      </p>
      <p className="t-lead contact__note hero-fade" style={{ "--i": 0 } as CSSProperties}>
        Write to me about roles, collaborations, or anything you saw here. I am open to backend, security and
        infrastructure roles, and usually reply within 48 hours.
      </p>
      <div className="hero__actions hero-fade" style={{ "--i": 1 } as CSSProperties}>
        <a href={`mailto:${EMAIL}`} className="btn">
          <Mail size={18} aria-hidden="true" />
          Send an email
        </a>
        <button type="button" className="btn-text" onClick={copyEmail}>
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy the address"}</span>
        </button>
      </div>
      <ul className="contact__channels hero-fade" style={{ "--i": 2 } as CSSProperties}>
        {CHANNELS.map((c) => (
          <li key={c.label}>
            <span className="muted">{c.label}</span>
            <a className="go" data-external href={c.href} target="_blank" rel="noopener noreferrer">
              {stripProtocol(c.href)}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </FlockHero>
  );
}
