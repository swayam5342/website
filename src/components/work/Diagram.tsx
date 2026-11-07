import type { FC } from "react";

/*
 * Architecture diagrams drawn in SVG from a project's own details.
 * Each diagram has two layouts: a wide one for tablets and up, and a tall
 * one for phones, so labels stay readable instead of shrinking with the
 * viewBox. The steps are also listed as text for screen readers.
 */

type Box = { x: number; y: number; w: number; h: number };

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  accent?: boolean;
  wide: Box;
  tall: Box;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  /** For a vertical edge: put its label left of the line (default right). */
  labelLeft?: boolean;
}

export interface DiagramSpec {
  title: string;
  wide: { w: number; h: number };
  tall: { w: number; h: number };
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const anchor = (a: Box, b: Box): [number, number, number, number] => {
  const ax = a.x + a.w / 2;
  const ay = a.y + a.h / 2;
  const bx = b.x + b.w / 2;
  const by = b.y + b.h / 2;
  // Same row: leave from the facing sides. Otherwise: top and bottom.
  if (Math.abs(ay - by) < 1) {
    return ax < bx ? [a.x + a.w, ay, b.x, by] : [a.x, ay, b.x + b.w, by];
  }
  return ay < by ? [ax, a.y + a.h, bx, b.y] : [ax, a.y, bx, b.y + b.h];
};

const Layout: FC<{ spec: DiagramSpec; mode: "wide" | "tall"; marker: string }> = ({
  spec,
  mode,
  marker,
}) => {
  const size = spec[mode];
  const box = (id: string) => spec.nodes.find((n) => n.id === id)![mode];
  const labelSize = 16;
  const subSize = mode === "tall" ? 13.5 : 13;

  return (
    <svg
      className={mode === "wide" ? "d-wide" : "d-tall"}
      viewBox={`0 0 ${size.w} ${size.h}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id={marker}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" className="d-arrow" />
        </marker>
      </defs>
      {spec.edges.map((e) => {
        const [x1, y1, x2, y2] = anchor(box(e.from), box(e.to));
        const flat = Math.abs(y1 - y2) < 1;
        // Stop a little short so the arrowhead sits outside the box.
        const len = Math.hypot(x2 - x1, y2 - y1) || 1;
        const gap = 4;
        const ex = x2 - ((x2 - x1) / len) * gap;
        const ey = y2 - ((y2 - y1) / len) * gap;
        return (
          <g key={`${e.from}-${e.to}`}>
            <line x1={x1} y1={y1} x2={ex} y2={ey} className="d-edge" markerEnd={`url(#${marker})`} />
            {e.label && (
              <text
                x={(x1 + x2) / 2 + (flat ? 0 : e.labelLeft ? -8 : 8)}
                y={(y1 + y2) / 2 + (flat ? -8 : 4)}
                textAnchor={flat ? "middle" : e.labelLeft ? "end" : "start"}
                className="d-edge-label"
                fontSize={12.5}
              >
                {e.label}
              </text>
            )}
          </g>
        );
      })}
      {spec.nodes.map((n) => {
        const b = n[mode];
        const cy = b.y + b.h / 2;
        return (
          <g key={n.id}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              className={n.accent ? "d-node d-node--accent" : "d-node"}
            />
            <text
              x={b.x + 14}
              y={n.sub ? cy - 4 : cy + 5.5}
              fontSize={labelSize}
              fontWeight={500}
            >
              {n.label}
            </text>
            {n.sub && (
              <text x={b.x + 14} y={cy + 15} fontSize={subSize} className="d-sub">
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
      {/* A packet that travels the path, edge by edge (still with reduced motion). */}
      <circle
        r={5}
        className="d-packet"
        style={{
          offsetPath: `path('${spec.edges
            .map((e) => {
              const [x1, y1, x2, y2] = anchor(box(e.from), box(e.to));
              return `M ${x1} ${y1} L ${x2} ${y2}`;
            })
            .join(" ")}')`,
          animationDuration: `${spec.edges.length * 1.1}s`,
        }}
      />
    </svg>
  );
};

export const Diagram: FC<{ spec: DiagramSpec }> = ({ spec }) => {
  const id = `dg-${spec.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="diagram">
      <Layout spec={spec} mode="wide" marker={`${id}-w`} />
      <Layout spec={spec} mode="tall" marker={`${id}-t`} />
      <ol className="sr-only">
        {spec.edges.map((e) => {
          const from = spec.nodes.find((n) => n.id === e.from)!;
          const to = spec.nodes.find((n) => n.id === e.to)!;
          return (
            <li key={`${e.from}-${e.to}`}>
              {from.label}
              {from.sub ? ` (${from.sub})` : ""} to {to.label}
              {to.sub ? ` (${to.sub})` : ""}
              {e.label ? `: ${e.label}` : ""}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Diagrams, one per project that needs one. Built from projects.json details. */
/* -------------------------------------------------------------------------- */

const W = 176; // wide node width
const H = 62;
const TW = 288; // tall node width
const TH = 60;
const tall = (i: number): Box => ({ x: 16, y: 12 + i * 92, w: TW, h: TH });

/* Three columns across an 860-wide canvas, two rows; phones get a single column. */
const C = [4, 330, 656];
const CW = 200;
const R1 = 20;
const R2 = 150;
const wbox = (col: number, row: number): Box => ({ x: C[col], y: row === 1 ? R1 : R2, w: CW, h: H });

export const DIAGRAMS: Record<string, DiagramSpec> = {
  dnsr: {
    title: "dnsr resolving www.github.com",
    wide: { w: 860, h: 232 },
    tall: { w: 320, h: 12 + 5 * 92 - 20 },
    nodes: [
      { id: "dnsr", label: "dnsr", sub: "wants www.github.com", wide: wbox(0, 1), tall: tall(0) },
      { id: "root", label: "Root server", sub: "e.root-servers.net", wide: wbox(1, 1), tall: tall(1) },
      { id: "com", label: ".com server", sub: "j.gtld-servers.net", wide: wbox(2, 1), tall: tall(2) },
      { id: "gh", label: "github.com server", sub: "ns-421.awsdns-52.com", wide: wbox(2, 2), tall: tall(3) },
      { id: "answer", label: "20.207.73.82", sub: "4 hops, 388 ms", accent: true, wide: wbox(1, 2), tall: tall(4) },
    ],
    edges: [
      { from: "dnsr", to: "root", label: "com. NS?" },
      { from: "root", to: "com", label: "github.com. NS?" },
      { from: "com", to: "gh", label: "www.github.com. A?", labelLeft: true },
      { from: "gh", to: "answer", label: "CNAME, then A" },
    ],
  },
  sandboxd: {
    title: "One Sandboxd request",
    wide: { w: 860, h: 232 },
    tall: { w: 320, h: 12 + 6 * 92 - 20 },
    nodes: [
      { id: "req", label: "POST /run", sub: "code and test cases", wide: wbox(0, 1), tall: tall(0) },
      { id: "check", label: "Validate", sub: "API key, size, flags", wide: wbox(1, 1), tall: tall(1) },
      { id: "reg", label: "Language registry", sub: "config/lang.yaml", wide: wbox(2, 1), tall: tall(2) },
      { id: "build", label: "Build in NsJail", sub: "pid, mount, net namespaces", wide: wbox(2, 2), tall: tall(3) },
      { id: "run", label: "Run each test", sub: "in NsJail, with limits", wide: wbox(1, 2), tall: tall(4) },
      { id: "verdict", label: "Verdict", sub: "status and output per test", accent: true, wide: wbox(0, 2), tall: tall(5) },
    ],
    edges: [
      { from: "req", to: "check" },
      { from: "check", to: "reg" },
      { from: "reg", to: "build" },
      { from: "build", to: "run" },
      { from: "run", to: "verdict" },
    ],
  },
  vulnscan: {
    title: "One VulnScan scan",
    wide: { w: 860, h: 232 },
    tall: { w: 320, h: 12 + 6 * 92 - 20 },
    nodes: [
      { id: "proj", label: "Your project", sub: "go.mod, npm, pip files", wide: wbox(0, 1), tall: tall(0) },
      { id: "parse", label: "Detect and parse", sub: "ecosystems, dependencies", wide: wbox(1, 1), tall: tall(1) },
      { id: "osv", label: "OSV.dev", sub: "batch queries, cached", wide: wbox(2, 1), tall: tall(2) },
      { id: "score", label: "Score", sub: "CVSS v3.1 from the vector", wide: wbox(2, 2), tall: tall(3) },
      { id: "report", label: "Report", sub: "table, JSON, Markdown, CSV", wide: wbox(1, 2), tall: tall(4) },
      { id: "fix", label: "Fix script", sub: "for you to review first", accent: true, wide: wbox(0, 2), tall: tall(5) },
    ],
    edges: [
      { from: "proj", to: "parse" },
      { from: "parse", to: "osv" },
      { from: "osv", to: "score" },
      { from: "score", to: "report" },
      { from: "report", to: "fix" },
    ],
  },
  tributary: {
    title: "Tributary architecture",
    wide: { w: 800, h: 232 },
    tall: { w: 320, h: 12 + 5 * 92 - 20 },
    nodes: [
      { id: "browser", label: "Browser", sub: "the React app", wide: { x: 4, y: 20, w: 176, h: H }, tall: tall(0) },
      { id: "web", label: "Node web server", sub: "serves app, proxies API", wide: { x: 214, y: 20, w: 236, h: H }, tall: tall(1) },
      { id: "api", label: "Go API on PostgreSQL", sub: "chi · pgx · sqlc · river jobs", wide: { x: 484, y: 20, w: 312, h: H }, tall: tall(2) },
      { id: "provider", label: "Drive provider", sub: "one interface, shared tests", wide: { x: 484, y: 150, w: 312, h: H }, tall: tall(3) },
      { id: "drive", label: "Google Drive accounts", sub: "pooled into one", accent: true, wide: { x: 214, y: 150, w: 236, h: H }, tall: tall(4) },
    ],
    edges: [
      { from: "browser", to: "web" },
      { from: "web", to: "api" },
      { from: "api", to: "provider" },
      { from: "provider", to: "drive" },
    ],
  },
  plugfit: {
    title: "PlugFit request path",
    wide: { w: 800, h: 232 },
    tall: { w: 320, h: 12 + 7 * 92 - 20 },
    nodes: [
      { id: "spec", label: "API spec", sub: "uploaded by a tenant", wide: { x: 4, y: 20, w: W, h: H }, tall: tall(0) },
      { id: "api", label: "FastAPI", sub: "async SQLAlchemy", wide: { x: 210, y: 20, w: W, h: H }, tall: tall(1) },
      { id: "queue", label: "Celery + Redis", sub: "async job queue", wide: { x: 416, y: 20, w: W, h: H }, tall: tall(2) },
      { id: "clean", label: "Cleaning pipeline", sub: "Gemini 2.0 Flash", wide: { x: 620, y: 20, w: W, h: H }, tall: tall(3) },
      { id: "registry", label: "Executor registry", sub: "serves cleaned specs", wide: { x: 620, y: 150, w: W, h: H }, tall: tall(4) },
      { id: "mcp", label: "MCP transport", sub: "custom layer", wide: { x: 416, y: 150, w: W, h: H }, tall: tall(5) },
      { id: "endpoint", label: "Live MCP endpoint", sub: "tenant-isolated", accent: true, wide: { x: 210, y: 150, w: W, h: H }, tall: tall(6) },
    ],
    edges: [
      { from: "spec", to: "api" },
      { from: "api", to: "queue" },
      { from: "queue", to: "clean" },
      { from: "clean", to: "registry" },
      { from: "registry", to: "mcp" },
      { from: "mcp", to: "endpoint" },
    ],
  },
};
