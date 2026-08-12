import type { FC } from "react";
import { Mail, GithubIcon, LinkedinIcon, PenSquare } from "lucide-react";
import socialData from "../data/social";

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 border-t border-brand-border bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left: Name / Copyright */}
        <p className="text-xs font-mono text-brand-muted uppercase tracking-widest">
          © {currentYear} SWAYAM
        </p>

        {/* Right: Contacts */}
        <div className="flex items-center gap-6">

          <a
            href={`mailto:${socialData.email}`}
            className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition"
          >
            <Mail size={16} />
            <span className="text-xs font-mono">EMAIL</span>
          </a>

          <a
            href={socialData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition"
          >
            <GithubIcon size={16} />
            <span className="text-xs font-mono">GITHUB</span>
          </a>

          <a
            href={socialData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition"
          >
            <LinkedinIcon size={16} />
            <span className="text-xs font-mono">LINKEDIN</span>
          </a>

          <a
            href={socialData.blog}
            target="_blank"
            className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition"
          >
            <PenSquare size={16}/>
            <span className="text-xs font-mono">BLOG</span>
          </a>

        </div>
      </div>
    </footer>
  );
};
