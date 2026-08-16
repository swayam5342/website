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

export interface SocialData {
  email: string;
  github: string;
  linkedin: string;
  blog: string;
}

export interface SiteData {
  name: string;
  url: string;
  titleTemplate: string;
  ogImage: string;
}

// A line can be plain text, or an object opting into extra styling/layout.
export interface TerminalOutputLine {
  text: string;
  /** Highlight the line in the accent color. */
  accent?: boolean;
  /** Render with heavier font weight. */
  bold?: boolean;
  /** Render faded/lower-emphasis. */
  dim?: boolean;
  /** Number of leading spaces to prepend. */
  indent?: number;
  /** Prefix the line with a bullet/glyph, e.g. "-", "*", "→". */
  prefix?: string;
}

export type TerminalLine = string | TerminalOutputLine;

export interface TerminalCommand {
  name: string;
  description: string;
  aliases?: string[];
  hidden?: boolean;
  output?: TerminalLine[];
  redirect?: string;
  opening?: TerminalLine;
  dynamic?: string;
  limit?: number;
  titleWidth?: number;
  descriptionMaxChars?: number;
  footer?: string;
}

export interface TerminalData {
  prompt: string;
  typeSpeedMs: number;
  linePauseMs: number;
  bootHint: string;
  bootCommands: string[];
  helpHeader: string;
  helpNameWidth: number;
  commandNotFound: string;
  commands: TerminalCommand[];
}
