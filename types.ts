
export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
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
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  year: string;
  file: string;
  verify?: string;
}

export interface ResumeData {
  default: string;
  security: string;
  backend: string;
}

export interface TimelineItem {
  id: number;
  type: 'education' | 'project' | 'achievement' | 'certification';
  title: string;
  subtitle: string;
  date: string;
  description: string;
}
