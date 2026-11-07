import type { CSSProperties, FC } from "react";
import Link from "next/link";

export interface SkillMapData {
  /** Projects that use at least one listed skill. */
  projects: { slug: string; title: string }[];
  /** Groups of skills, each with the slugs of the projects that use it. */
  groups: { label: string; skills: { name: string; used: string[] }[] }[];
  /** Skills no project is tagged with yet. */
  unused: string[];
}

/**
 * Skills ranked by how many projects use them, from the project data: a bar
 * and a count per skill, groups side by side. Each skill links to the
 * projects list filtered to it; pointing at a row names those projects.
 */
export const SkillMap: FC<{ data: SkillMapData }> = ({ data }) => {
  const titleOf = (slug: string) => data.projects.find((p) => p.slug === slug)?.title ?? slug;
  const max = Math.max(1, ...data.groups.flatMap((g) => g.skills.map((s) => s.used.length)));

  return (
    <>
      <div className="skillbars">
        {data.groups.map((g) => (
          <section key={g.label} className="skillbars__group" aria-label={g.label}>
            <h3 className="skillbars__label">{g.label}</h3>
            <ul>
              {[...g.skills]
                .sort((a, b) => b.used.length - a.used.length)
                .map((s) => (
                  <li key={s.name} className="skillbar">
                    <Link
                      href={`/projects?tag=${encodeURIComponent(s.name)}`}
                      className="skillbar__link"
                      title={s.used.map(titleOf).join(", ")}
                    >
                      <span className="skillbar__name">{s.name}</span>
                      <span className="skillbar__track" aria-hidden="true">
                        <span
                          className="skillbar__fill"
                          style={{ "--w": s.used.length / max } as CSSProperties}
                        />
                      </span>
                      <span className="skillbar__count tabular">{s.used.length}</span>
                      <span className="sr-only">
                        {s.used.length === 1 ? " project: " : " projects: "}
                        {s.used.map(titleOf).join(", ")}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
      {data.unused.length > 0 && (
        <p className="muted skillmap__also">Also, not in a project here yet: {data.unused.join(", ")}.</p>
      )}
    </>
  );
};
