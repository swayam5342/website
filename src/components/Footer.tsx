import type { FC } from "react";
import { Mail, GithubIcon, LinkedinIcon, PenSquare } from "lucide-react";
import socialData from "../data/social";

const linkClass =
  "flex items-center gap-2 text-brand-muted hover:text-brand-text transition-colors";

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-brand-border bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Left: Name / Copyright */}
        <p className="display text-2xl">
          Swayam <span className="text-brand-muted">© {currentYear}</span>
        </p>

        {/* Right: Contacts */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={`mailto:${socialData.email}`} className={linkClass}>
            <Mail size={16} />
            <span className="text-sm">Email</span>
          </a>

          <a
            href={socialData.github}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <GithubIcon size={16} />
            <span className="text-sm">GitHub</span>
          </a>

          <a
            href={socialData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <LinkedinIcon size={16} />
            <span className="text-sm">LinkedIn</span>
          </a>

          <a href={socialData.blog} target="_blank" className={linkClass}>
            <PenSquare size={16} />
            <span className="text-sm">Blog</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
