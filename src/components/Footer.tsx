import type { FC } from "react";
import socialData from "../data/social";
import { ThemeSwitch } from "./ThemeSwitch";

const LINKS = [
  { label: "Email", href: `mailto:${socialData.email}` },
  { label: "GitHub", href: socialData.github, external: true },
  { label: "LinkedIn", href: socialData.linkedin, external: true },
  { label: "Blog", href: socialData.blog, external: true },
];

/** One quiet line: what this is, where to find me, the year and the theme. */
export const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="frame site-footer__line">
        <p className="muted">Swayam · backends, security tools, low-level systems</p>
        <ul className="site-footer__links">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                className="link"
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="site-footer__end">
          <ThemeSwitch />
          <span className="muted" style={{ marginLeft: "1.25rem" }}>
            © {year}
          </span>
        </div>
      </div>
    </footer>
  );
};
