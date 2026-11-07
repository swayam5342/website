import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, SquareTerminal } from "lucide-react";
import projectsData from "@/src/data/projects";
import homeData from "@/src/data/home";
import aboutData from "@/src/data/about";
import socialData from "@/src/data/social";
import { getShowcase } from "@/src/data/showcase";
import { PageTransition } from "@/src/components/PageTransition";
import { FlockHero } from "@/src/components/home/FlockHero";
import { PlayList, type PlayItem } from "@/src/components/home/PlayList";
import { CaseStudies } from "@/src/components/work/CaseStudies";
import { TerminalTrigger } from "@/src/components/TerminalTrigger";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const boids = projectsData.find((p) => p.slug === "boids-sim");

const visibleCount = projectsData.filter((p) => p.show !== false).length;

const spotlight = projectsData
  .filter((p) => typeof p.spotlight === "number")
  .sort((a, b) => a.spotlight! - b.spotlight!);

/** The playful section: projects tagged Recreational that have a live demo. */
const play: PlayItem[] = projectsData
  .filter((p) => p.tags.includes("Recreational") && p.demo)
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    lang: p.lang ?? [],
    demo: p.demo!,
    show: getShowcase(p.slug),
  }));


export default function Home() {
  return (
    <PageTransition>
      <FlockHero
        readout={{
          pause: "Pause the flock",
          play: "Play the flock",
          source: "From my Boids project",
          sourceHref: boids?.demo ?? "#play",
        }}
      >
        <h1 id="hero-name" className="hero__name t-display">
          <span className="mask-line">
            <span>{homeData.name}</span>
          </span>
        </h1>
        <p className="hero__lead t-lead hero-fade" style={{ "--i": 0 } as CSSProperties}>
          {homeData.lead}
        </p>
        <p className="hero__edu muted hero-fade" style={{ "--i": 1 } as CSSProperties}>
          {homeData.education}
        </p>
        <div className="hero__actions hero-fade" style={{ "--i": 2 } as CSSProperties}>
          <Link href="#work" className="btn">
            {homeData.work_cta}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <TerminalTrigger>
            <SquareTerminal size={18} aria-hidden="true" />
            {homeData.terminal_cta}
          </TerminalTrigger>
        </div>
      </FlockHero>

      {/* Selected work: five case studies, each with something real to look at */}
      <section id="work" className="frame section" aria-labelledby="work-heading">
        <div className="section-head" data-reveal>
          <h2 id="work-heading" className="t-h2">
            {homeData.work_heading}
          </h2>
          <p>{homeData.work_intro}</p>
        </div>

        <CaseStudies projects={spotlight} />

        <p className="section-foot">
          <Link href="/projects" className="go">
            {homeData.index_link.replace("{count}", String(visibleCount))}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </p>
      </section>

      {/* Made for fun */}
      <section id="play" className="frame section" aria-labelledby="play-heading">
        <div className="section-head" data-reveal>
          <h2 id="play-heading" className="t-h2">
            {homeData.play_heading}
          </h2>
          <p>{homeData.play_intro}</p>
        </div>
        <PlayList items={play} demoLabel="Open the demo" />
      </section>

      {/* About, and how to reach me */}
      <section className="frame section" aria-labelledby="close-heading">
        <div className="close" data-reveal>
          <Image
            src={aboutData.photo}
            alt="Portrait of Swayam"
            width={505}
            height={495}
            className="close__photo"
            sizes="(min-width: 64rem) 22vw, 48vw"
          />
          <div className="close__text">
            <h2 id="close-heading" className="t-h2">
              {homeData.close_heading}
            </h2>
            <p className="close__statement" style={{ marginTop: "1.25rem" }}>
              {aboutData.main_text}
            </p>
            <p className="muted" style={{ marginTop: "1.25rem" }}>
              {homeData.close_text}
            </p>
            <div className="close__links" style={{ marginTop: "0.5rem" }}>
              <Link href="/about" className="go">
                More about me
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/resume" className="go">
                Resume
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a href={`mailto:${socialData.email}`} className="go">
                {socialData.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
