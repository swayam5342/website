import showcaseJson from './showcase.json';

export interface Showcase {
  kind: 'image' | 'video' | 'diagram' | 'code' | 'terminal';
  caption: string;
  /** image */
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
  /** video: a still shown before it plays */
  poster?: string;
  /** Extra figures shown only on the case study page */
  also?: Showcase[];
  /** diagram: key into DIAGRAMS in src/components/work/Diagram.tsx */
  diagram?: string;
  /** code: path inside the project's repository and the line range shown */
  file?: string;
  lines?: number[];
  language?: string;
  /** code and terminal */
  code?: string;
  /** terminal: the command that was run */
  title?: string;
}

const { _note, ...entries } = showcaseJson as Record<string, unknown>;
void _note;

const showcase = entries as Record<string, Showcase>;

export const getShowcase = (slug: string): Showcase | undefined => showcase[slug];

export default showcase;
