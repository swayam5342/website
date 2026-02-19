import {
  Experience,
  Project,
  Education,
  Certificate,
  TimelineItem
} from "../../types";


function detectExperienceCategory(title: string): TimelineItem["category"] {
  const t = title.toLowerCase();

  if (t.includes("security") || t.includes("analyst"))
    return "security";

  if (t.includes("backend") || t.includes("api"))
    return "backend";

  return "development";
}


export function mapExperiencesToTimeline(exps: Experience[]): TimelineItem[] {
  return exps.map(exp => ({
    id: exp.id,
    category: detectExperienceCategory(exp.title),
    title: exp.title,
    subtitle: exp.company,
    date: exp.period,
    description: exp.description,
  }));
}

export function mapProjectsToTimeline(projects: Project[]): TimelineItem[] {
  return projects.map(p => ({
    id: p.id,
    category: "project",
    title: p.title,
    subtitle: "Personal Project",
    date: new Date(p.date).getFullYear().toString(),
    description: p.description,
  }));
}

export function mapEducationToTimeline(edu: Education[]): TimelineItem[] {
  return edu.map(e => ({
    id: e.id,
    category: "education",
    title: e.degree,
    subtitle: e.institution,
    date: e.period,
    description: e.description,
  }));
}

export function mapCertificatesToTimeline(certs: Certificate[]): TimelineItem[] {
  return certs.map(c => ({
    id: c.id,
    category: "certificate",
    title: c.name,
    subtitle: c.issuer,
    date: c.year,
    description: "Certification completed",
  }));
}
