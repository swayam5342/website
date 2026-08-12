import type { Metadata } from "next";
import { projectsMeta } from "@/src/data/projects";
import ProjectsView from "./ProjectsView";

export const metadata: Metadata = {
  title: projectsMeta.main_heading,
  description: projectsMeta.sub_heading,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: projectsMeta.main_heading,
    description: projectsMeta.sub_heading,
    url: "/projects",
  },
};

export default function Projects() {
  return <ProjectsView />;
}
