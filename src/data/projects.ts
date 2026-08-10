
import type { Project } from '../../types';
import projectsJson from './projects.json';
const projectsData: Project[] = [...projectsJson.project].sort((a, b) => a.order - b.order);

export const projectsMeta = {
  main_heading: projectsJson.main_heading,
  sub_heading: projectsJson.sub_heading,
};

export default projectsData;
