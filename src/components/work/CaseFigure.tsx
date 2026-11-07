import type { FC, ReactNode } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import { Diagram, DIAGRAMS } from "./Diagram";
import { AutoVideo } from "./AutoVideo";
import type { Showcase } from "@/src/data/showcase";

/*
 * What a case study shows: the project's own screenshot, a verbatim code
 * excerpt from its repository, a recorded terminal run, or a diagram drawn
 * from its architecture notes. Never a mock-up.
 */

const GO_KEYWORDS = /\b(func|return|if|else|var|for|range|type|struct|package|import|const|nil)\b/g;

/** Very small highlighter: comments dim, YAML keys and Go keywords in the accent. */
const highlight = (code: string, language?: string): ReactNode[] =>
  code.split("\n").map((line, i) => {
    let body: ReactNode = line;
    if (language === "yaml") {
      const m = line.match(/^(\s*-?\s*)([A-Za-z_]+)(:)(.*)$/);
      if (m) {
        body = (
          <>
            {m[1]}
            <span className="c-acc">{m[2]}</span>
            {m[3]}
            {m[4]}
          </>
        );
      }
    } else if (language === "json") {
      const m = line.match(/^(\s*)("[^"]+")(:)(.*)$/);
      if (m) {
        body = (
          <>
            {m[1]}
            <span className="c-acc">{m[2]}</span>
            {m[3]}
            {m[4]}
          </>
        );
      }
    } else if (language === "go") {
      const comment = line.indexOf("//");
      const code_ = comment >= 0 ? line.slice(0, comment) : line;
      const parts: ReactNode[] = [];
      let last = 0;
      for (const m of code_.matchAll(GO_KEYWORDS)) {
        parts.push(code_.slice(last, m.index));
        parts.push(
          <span key={m.index} className="c-acc">
            {m[0]}
          </span>
        );
        last = m.index! + m[0].length;
      }
      parts.push(code_.slice(last));
      if (comment >= 0) parts.push(<span key="c" className="c-dim">{line.slice(comment)}</span>);
      body = parts;
    }
    return (
      <span key={i}>
        {body}
        {"\n"}
      </span>
    );
  });

/** Terminal output: the command line bright, protocol chatter dim, answers bright. */
const terminalLines = (code: string): ReactNode[] =>
  code.split("\n").map((line, i) => {
    const cls = line.startsWith("$ ")
      ? "c-ink"
      : line.startsWith(";;")
        ? "c-acc"
        : /^\S+\.\s+\d+\s+IN\s/.test(line)
          ? "c-ink"
          : "c-dim";
    return (
      <span key={i} className={cls}>
        {line}
        {"\n"}
      </span>
    );
  });

interface CaseFigureProps {
  show: Showcase;
  repo?: string;
  /** Large first-screen images load eagerly. */
  priority?: boolean;
  /** Shared view-transition name: the same picture on the list and the case study morphs between them. */
  transitionName?: string;
  /** 90 on the case study page, where the screenshot is shown large; 75 in lists. */
  quality?: 75 | 90;
}

export const CaseFigure: FC<CaseFigureProps> = ({ show, repo, priority, transitionName, quality = 75 }) => {
  let media: ReactNode = null;

  if (show.kind === "image") {
    media = (
      <div className="fig__media">
        <Image
          src={show.src!}
          width={show.width!}
          height={show.height!}
          alt={show.alt!}
          sizes="(min-width: 64rem) 60vw, 100vw"
          className="drift"
          priority={priority}
          quality={quality}
        />
      </div>
    );
  } else if (show.kind === "video") {
    media = (
      <div className="fig__media">
        <AutoVideo src={show.src!} poster={show.poster} width={show.width!} height={show.height!} label={show.alt!} />
      </div>
    );
  } else if (show.kind === "diagram") {
    const spec = DIAGRAMS[show.diagram!];
    media = spec ? <Diagram spec={spec} /> : null;
  } else if (show.kind === "code") {
    const [from, to] = show.lines ?? [];
    media = (
      <div className="panel">
        <div className="panel__bar">
          <span>{show.file}</span>
          {from && (
            <span className="tabular">
              {repo ? (
                <a
                  className="link"
                  style={{ color: "inherit" }}
                  href={`${repo}/blob/HEAD/${show.file}#L${from}-L${to}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lines {from}–{to}
                </a>
              ) : (
                `Lines ${from}–${to}`
              )}
            </span>
          )}
        </div>
        <pre tabIndex={0} aria-label={`${show.file}, lines ${from} to ${to}`}>
          <code>{highlight(show.code!, show.language)}</code>
        </pre>
      </div>
    );
  } else if (show.kind === "terminal") {
    media = (
      <div className="panel">
        <div className="panel__bar">
          <span>Terminal</span>
          <span>{show.title}</span>
        </div>
        <pre tabIndex={0} aria-label={`Terminal output of ${show.title}`} style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          <code>{terminalLines(show.code!)}</code>
        </pre>
      </div>
    );
  }

  return (
    <figure className="fig">
      {transitionName ? (
        <ViewTransition name={transitionName} share="morph" default="none">
          {media}
        </ViewTransition>
      ) : (
        media
      )}
      <figcaption>{show.caption}</figcaption>
    </figure>
  );
};
