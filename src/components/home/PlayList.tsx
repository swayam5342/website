"use client";

import type { FC } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Showcase } from "@/src/data/showcase";

export interface PlayItem {
  slug: string;
  title: string;
  description: string;
  lang: string[];
  demo: string;
  show?: Showcase;
}

/**
 * Small things built for fun, each with its live demo. On a wide screen the
 * picture beside the list follows the row under the pointer or focus; on a
 * phone each row carries its own picture.
 */
export const PlayList: FC<{ items: PlayItem[]; demoLabel: string }> = ({ items, demoLabel }) => {
  const [active, setActive] = useState(items[0]?.slug);

  return (
    <div className="play">
      <ul className="play__list" data-reveal>
        {items.map((p) => (
          <li
            key={p.slug}
            className="play__item"
            data-active={active === p.slug}
            onPointerEnter={() => setActive(p.slug)}
            onFocus={() => setActive(p.slug)}
          >
            {p.show?.kind === "image" && (
              <figure className="fig">
                <div className="fig__media">
                  <Image
                    src={p.show.src!}
                    width={p.show.width!}
                    height={p.show.height!}
                    alt={p.show.alt!}
                    sizes="100vw"
                  />
                </div>
              </figure>
            )}
            <div className="play__row">
              <h3 className="play__name">
                <Link href={`/projects/${p.slug}`} className="case-link">
                  {p.title}
                </Link>
              </h3>
              <a
                className="go t-small"
                data-external
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${demoLabel}: ${p.title} (opens in a new tab)`}
              >
                {demoLabel}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <p className="play__desc">{p.description}</p>
              <p className="case__stack">{p.lang.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="play__stage" aria-hidden="true">
        <div className="fig__media">
          {items.map(
            (p) =>
              p.show?.kind === "image" && (
                <Image
                  key={p.slug}
                  src={p.show.src!}
                  width={p.show.width!}
                  height={p.show.height!}
                  alt=""
                  sizes="45vw"
                  data-active={active === p.slug}
                />
              )
          )}
        </div>
        <p className="t-small muted" style={{ marginTop: "0.75rem" }}>
          {items.find((p) => p.slug === active)?.show?.caption}
        </p>
      </div>
    </div>
  );
};
