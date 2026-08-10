import type {
  Experience,
  Project,
  Education,
  Certificate,
  TimelineItem,
} from "../../types";



export function mapExperiencesToTimeline(exps: Experience[]): TimelineItem[] {
  return exps.map(exp => ({
    id: exp.id,
    order: exp.id,
    type: exp.type.toLowerCase() as TimelineItem["type"],
    title: exp.title,
    subtitle: exp.company,
    date: exp.period,
    description: exp.description,
  }));
}

export function mapProjectsToTimeline(projects: Project[]): TimelineItem[] {
  return projects.map(p => ({
    id: p.id,
    order: p.order,
    type: "project",
    title: p.title,
    subtitle: "Personal Project",
    date: new Date(p.date).getFullYear().toString(),
    description: p.description,
  }));
}

export function mapEducationToTimeline(edu: Education[]): TimelineItem[] {
  return edu.map(e => ({
    id: e.id,
    order: e.id,
    type: "education",
    title: e.degree,
    subtitle: e.institution,
    date: e.period,
    description: e.description,
  }));
}

export function mapCertificatesToTimeline(certs: Certificate[]): TimelineItem[] {
  return certs.map(c => ({
    id: c.id,
    order: c.order,
    type: "certificate",
    title: c.name,
    subtitle: c.issuer,
    date: c.year,
    description: "Certification completed",
  }));
}