
import type { Project } from '../../types';
import projectsJson from './projects.json';
const projectsData: Project[] = [...projectsJson.project].sort((a, b) => a.order - b.order);

export const projectsMeta = {
  main_heading: projectsJson.main_heading,
  sub_heading: projectsJson.sub_heading,
};

/** A project's own icon wins; Recreational projects without one get a shared generic icon. */
export const getProjectIcon = (project: Project): string | undefined => {
  if (project.icon) return project.icon;
  if (project.tags.includes('Recreational')) return 'gamepad-2';
  return undefined;
};

export default projectsData;
