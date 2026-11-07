import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** A small flock, drawn the way the hero draws its boids, with one that strayed. */
const FLOCK: [number, number, number][] = [
  [60, 70, 20], [92, 58, 14], [80, 96, 24], [118, 80, 18], [104, 112, 26], [140, 66, 12],
  [132, 104, 20], [162, 90, 16], [150, 130, 28], [176, 118, 22], [70, 130, 30], [120, 140, 24],
];
const boid = (x: number, y: number, deg: number) => {
  const r = (deg * Math.PI) / 180;
  const dx = Math.cos(r);
  const dy = Math.sin(r);
  const p = (a: number, b: number) => `${(x + a).toFixed(1)},${(y + b).toFixed(1)}`;
  return [p(dx * 9, dy * 9), p(-dx * 5.4 - dy * 3.4, -dy * 5.4 + dx * 3.4), p(-dx * 5.4 + dy * 3.4, -dy * 5.4 - dx * 3.4)].join(" ");
};

export default function NotFound() {
  return (
    <div className="frame notfound">
      <svg className="notfound__flock" viewBox="0 0 420 200" aria-hidden="true" focusable="false">
        {FLOCK.map(([x, y, d], i) => (
          <polygon key={i} points={boid(x, y, d)} fill="currentColor" />
        ))}
        <polygon className="notfound__stray" points={boid(372, 160, 32)} fill="currentColor" />
      </svg>
      <h1 className="t-display">Page not found</h1>
      <p className="t-lead measure">
        This page strayed from the flock. It may have moved when the site was rebuilt.
      </p>
      <p className="notfound__links">
        <Link href="/" className="btn">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to the home page
        </Link>
        <Link href="/projects" className="go">
          See my projects
        </Link>
      </p>
    </div>
  );
}
