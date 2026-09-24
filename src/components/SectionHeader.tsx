import type { FC } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface SectionHeaderProps {
  index: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

/** Numbered section title with an optional "see all" link. */
export const SectionHeader: FC<SectionHeaderProps> = ({
  index,
  title,
  href,
  linkLabel,
}) => (
  <div className="flex items-baseline justify-between gap-6 border-t border-brand-border pt-6">
    <div className="flex items-baseline gap-4">
      <span className="eyebrow">{index}</span>
      <h2 className="display text-3xl md:text-4xl">{title}</h2>
    </div>
    {href && (
      <Link
        href={href}
        className="group flex shrink-0 items-center gap-1 text-sm text-brand-muted transition-colors hover:text-brand-text"
      >
        {linkLabel}
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
    )}
  </div>
);
