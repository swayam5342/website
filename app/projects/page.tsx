import type { Metadata } from "next";
import siteData from "@/src/data/site";
import projectsData, { projectsMeta } from "@/src/data/projects";
import { CaseStudies } from "@/src/components/work/CaseStudies";
import { PageTransition } from "@/src/components/PageTransition";
import ProjectsView from "./ProjectsView";

const description =
  "Everything Swayam has built: case studies of Tributary, PlugFit, Sandboxd, dnsr and VulnScan, then every other project.";

export const metadata: Metadata = {
  title: projectsMeta.main_heading,
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
      images: [{ url: siteData.ogImage }],
    title: projectsMeta.main_heading,
    description,
    url: "/projects",
  },
};

const spotlight = projectsData
  .filter((p) => typeof p.spotlight === "number")
  .sort((a, b) => a.spotlight! - b.spotlight!);

export default function Projects() {
  return (
    <PageTransition>
      <div className="frame">
        <header className="page-head" data-reveal>
          <h1 className="t-display page-title">{projectsMeta.main_heading}</h1>
          <p className="t-lead measure">{projectsMeta.sub_heading}</p>
        </header>
        <section id="cases" className="section-tight" aria-labelledby="cases-heading">
          <h2 id="cases-heading" className="t-h2 section-title">
            Case studies
          </h2>
          <CaseStudies projects={spotlight} withPoints />
        </section>
        <ProjectsView indexHeading="Everything else" />
      </div>
    </PageTransition>
  );
}
