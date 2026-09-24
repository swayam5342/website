import type { FC, ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  /** Right-aligned content, e.g. filters or a portrait */
  aside?: ReactNode;
}

/** Editorial page opener: small label, large serif title, muted lede. */
export const PageHeader: FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  aside,
}) => (
  <header className="mb-16 flex flex-col gap-10 border-b border-brand-border pb-12 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl">
      <p className="eyebrow mb-6">{eyebrow}</p>
      <h1 className="display text-5xl md:text-7xl">{title}</h1>
      {description && (
        <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-muted">
          {description}
        </p>
      )}
    </div>
    {aside}
  </header>
);
