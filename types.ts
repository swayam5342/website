export type ResumeVariant = "security" | "backend" | "development";

export interface Project {
  id: number;
  order: number;
  slug: string;
  title: string;
  description: string;
  lang?: string[],
  icon?: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  resume_points: string[];
  details?: {
    architecture: string;
    challenges: string;
    security: string;
    improvements: string;
  };
  date?: string;
}


export type HomeCardItem = {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  type: string;
  description: string;
  skills?: string[];
};

export interface ResumeData {
  default: string;
  security: string;
  backend: string;
}

export interface Certificate {
  id: number;
  order: number;
  name: string;
  issuer: string;
  year: string;
  file: string;
  verify?: string;
  icon?: string;
}

export interface Education {
  id: number;
  period: string;
  degree: string;
  institution: string;
  description: string;
  skills: string[];
  date: string;
}

export interface Experience {
  id: number;
  period: string;
  type: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  date?: string;
}

export type TimelineCategory =
  | "security"
  | "backend"
  | "development"
  | "education"
  | "project"
  | "certificate";

export interface TimelineItem {
  id: number;
  order: number;
  type: TimelineCategory;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface SkillData {
  core: string[];
  backend: string[];
  database: string[];
  devops: string[];
  cyber: string[];
}

export interface AboutData {
  heading: string;
  name: string;
  roles: string[];
  photo: string;
  main_text: string;
  sub_text: string;
  security_principles: string[];
}

export interface HomeData {
  main_heading: string;
  project: string;
  main_text: string;
}
