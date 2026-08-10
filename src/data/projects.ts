
import type { Project } from '../../types';
import projectsJson from './projects.json';
const projectsData: Project[] = [...projectsJson.project].sort((a, b) => a.order - b.order);

export default projectsData;
