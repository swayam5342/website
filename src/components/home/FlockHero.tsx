"use client";

import type { CSSProperties, FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

/*
 * The hero's flock: a port of github.com/swayam5342/boid (Go + Ebiten).
 * The four rules and their weights are the ones in boid/game.go:
 *
 *   perceptionRadius 100, separation within half of it,
 *   alignment 0.1, cohesion 0.05, separation 0.3,
 *   centralization 0.3 outside a 200 px radius,
 *   each force = normalize(desired - velocity) * steerForce(1) * weight,
 *   velocity limited to moveSpeed (20).
 *
 * Two things are added for the page: the flock steers around the headline
 * so it never covers the words, and it scatters from the pointer or a
 * finger. Speed is scaled down so it drifts rather than darts.
 */

const RULES = {
  perception: 100,
  alignment: 0.1,
  cohesion: 0.05,
  separation: 0.3,
  centralization: 0.3,
  centralRadius: 200,
  moveSpeed: 20,
  steerForce: 1,
} as const;

/* Page-only additions */
const STEP_SCALE = 0.17; // px moved per frame per unit of velocity
const AVOID_PAD = 28; // keep this far from the headline block
const AVOID_FORCE = 0.9;
const POINTER_RADIUS = 110;
const POINTER_FORCE = 0.9;

type Boid = { x: number; y: number; vx: number; vy: number };

/** Fire this on window to burst the flock outward from the words (e.g. after copying). */
export const FLOCK_SCATTER_EVENT = "flock:scatter";

interface FlockHeroProps {
  /** The headline block the flock flows around. */
  children: ReactNode;
  readout: { pause: string; play: string; source?: string; sourceHref?: string };
  /** id of the heading that names this section. */
  labelledBy?: string;
  /** Show the rules (boid count and weights) under the words. */
  showRules?: boolean;
  className?: string;
}

export const FlockHero: FC<FlockHeroProps> = ({
  children,
  readout,
  labelledBy = "hero-name",
  showRules = true,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const copy = copyRef.current;
    if (!canvas || !copy) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    setStill(reduced);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let boids: Boid[] = [];
    let avoid = { x0: 0, y0: 0, x1: 0, y1: 0 };
    let target = { x: 0, y: 0 };
    const pointer = { x: -9999, y: -9999, active: false };
    let colour = "#1f4dc4";
    let raf = 0;
    let visible = true;

    const readColour = () => {
      colour = getComputedStyle(canvas).getPropertyValue("--flock").trim() || colour;
    };

    const measure = () => {
      const r = canvas.getBoundingClientRect();
      const c = copy.getBoundingClientRect();
      avoid = {
        x0: c.left - r.left - AVOID_PAD,
        y0: c.top - r.top - AVOID_PAD,
        x1: c.right - r.left + AVOID_PAD,
        y1: c.bottom - r.top + AVOID_PAD,
      };
      // The flock gathers in the open ground: right of the words on a wide
      // screen, above them on a phone.
      // On a phone, use whichever band is larger: above the words or below.
      const wide = w >= 768;
      const above = avoid.y0;
      const below = h - avoid.y1;
      target = wide
        ? { x: w * 0.7, y: h * 0.42 }
        : { x: w * 0.5, y: above >= below ? Math.max(80, above * 0.5) : avoid.y1 + below * 0.5 };
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      // Phones redraw a tall canvas every frame: 1.5x density is sharp enough there.
      dpr = Math.min(window.devicePixelRatio || 1, r.width < 768 ? 1.5 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measure();
      // About one boid per 11,000 px², between 40 and the original 100.
      const n = Math.max(40, Math.min(100, Math.round((w * h) / 11000)));
      if (boids.length !== n) {
        const next: Boid[] = boids.slice(0, n);
        while (next.length < n) {
          let x = 0;
          let y = 0;
          // Start in the open ground near where the flock gathers.
          let tries = 0;
          do {
            x = target.x + (Math.random() - 0.5) * Math.min(w, 520);
            y = target.y + (Math.random() - 0.5) * Math.min(h, 360);
            tries++;
          } while (tries < 20 && x > avoid.x0 && x < avoid.x1 && y > avoid.y0 && y < avoid.y1);
          next.push({ x, y, vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1 });
        }
        boids = next;
        setCount(n);
      }
    };

    // Scratch space, so a frame allocates nothing (smooth on slow phones).
    let nvx = new Float64Array(0);
    let nvy = new Float64Array(0);
    let sx_ = 0;
    let sy_ = 0;
    /** Boid.steer from game.go: normalise(normalise(d) * moveSpeed - vel) * steerForce, into sx_/sy_. */
    const steerInto = (bvx: number, bvy: number, dx: number, dy: number) => {
      const l = Math.sqrt(dx * dx + dy * dy);
      const tx = (l === 0 ? 0 : (dx / l) * RULES.moveSpeed) - bvx;
      const ty = (l === 0 ? 0 : (dy / l) * RULES.moveSpeed) - bvy;
      const l2 = Math.sqrt(tx * tx + ty * ty);
      sx_ = l2 === 0 ? 0 : (tx / l2) * RULES.steerForce;
      sy_ = l2 === 0 ? 0 : (ty / l2) * RULES.steerForce;
    };

    const step = () => {
      const p2 = RULES.perception * RULES.perception;
      const s2 = (RULES.perception / 2) ** 2;
      const c2 = RULES.centralRadius * RULES.centralRadius;
      const r2 = POINTER_RADIUS * POINTER_RADIUS;
      const count = boids.length;
      if (nvx.length !== count) {
        nvx = new Float64Array(count);
        nvy = new Float64Array(count);
      }
      for (let i = 0; i < count; i++) {
        const b = boids[i];
        let avx = 0, avy = 0, cx = 0, cy = 0, sx = 0, sy = 0;
        let n = 0, sn = 0;
        for (let j = 0; j < count; j++) {
          if (j === i) continue;
          const o = boids[j];
          const dx = b.x - o.x;
          const dy = b.y - o.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= p2) continue;
          n++;
          avx += o.vx;
          avy += o.vy;
          cx += o.x;
          cy += o.y;
          if (d2 < s2 && d2 > 0) {
            // normalize(diff) / |diff|, as in separation()
            sx += dx / d2;
            sy += dy / d2;
            sn++;
          }
        }
        let fx = 0, fy = 0;
        if (n > 0) {
          steerInto(b.vx, b.vy, avx / n, avy / n);
          fx += sx_ * RULES.alignment;
          fy += sy_ * RULES.alignment;
          steerInto(b.vx, b.vy, cx / n - b.x, cy / n - b.y);
          fx += sx_ * RULES.cohesion;
          fy += sy_ * RULES.cohesion;
        }
        if (sn > 0) {
          steerInto(b.vx, b.vy, sx / sn, sy / sn);
          fx += sx_ * RULES.separation;
          fy += sy_ * RULES.separation;
        }
        const tdx = target.x - b.x;
        const tdy = target.y - b.y;
        if (tdx * tdx + tdy * tdy >= c2) {
          steerInto(b.vx, b.vy, tdx, tdy);
          fx += sx_ * RULES.centralization;
          fy += sy_ * RULES.centralization;
        }

        // Page addition: flow around the headline block.
        if (b.x > avoid.x0 && b.x < avoid.x1 && b.y > avoid.y0 && b.y < avoid.y1) {
          const left = b.x - avoid.x0;
          const right = avoid.x1 - b.x;
          const top = b.y - avoid.y0;
          const bottom = avoid.y1 - b.y;
          const m = Math.min(left, right, top, bottom);
          steerInto(b.vx, b.vy, m === left ? -1 : m === right ? 1 : 0, m === top ? -1 : m === bottom ? 1 : 0);
          fx += sx_ * AVOID_FORCE * 2;
          fy += sy_ * AVOID_FORCE * 2;
        }

        // Page addition: scatter from the pointer.
        if (pointer.active) {
          const qx = b.x - pointer.x;
          const qy = b.y - pointer.y;
          if (qx * qx + qy * qy < r2) {
            steerInto(b.vx, b.vy, qx, qy);
            fx += sx_ * POINTER_FORCE;
            fy += sy_ * POINTER_FORCE;
          }
        }

        let vx = b.vx + fx;
        let vy = b.vy + fy;
        const sp2 = vx * vx + vy * vy;
        if (sp2 > RULES.moveSpeed * RULES.moveSpeed) {
          const sp = Math.sqrt(sp2);
          vx = (vx / sp) * RULES.moveSpeed;
          vy = (vy / sp) * RULES.moveSpeed;
        }
        nvx[i] = vx;
        nvy[i] = vy;
      }
      // Apply after every boid has read the same frame. (game.go updates in
      // place, so later boids see earlier ones moved; one frame is steadier.)
      for (let i = 0; i < count; i++) {
        const b = boids[i];
        b.vx = nvx[i];
        b.vy = nvy[i];
        b.x += b.vx * STEP_SCALE;
        b.y += b.vy * STEP_SCALE;
        // Wrap if one strays far off the canvas.
        if (b.x < -60) b.x = w + 50;
        else if (b.x > w + 60) b.x = -50;
        if (b.y < -60) b.y = h + 50;
        else if (b.y > h + 60) b.y = -50;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = colour;
      const len = 7;
      const back = len * 0.6;
      const half = 2.6;
      // One path and one fill for the whole flock.
      ctx.beginPath();
      for (const b of boids) {
        const l = Math.sqrt(b.vx * b.vx + b.vy * b.vy) || 1;
        const dx = b.vx / l;
        const dy = b.vy / l;
        ctx.moveTo(b.x + dx * len, b.y + dy * len);
        ctx.lineTo(b.x - dx * back - dy * half, b.y - dy * back + dx * half);
        ctx.lineTo(b.x - dx * back + dy * half, b.y - dy * back - dx * half);
        ctx.closePath();
      }
      ctx.fill();
    };

    const loop = () => {
      raf = 0;
      if (pausedRef.current || reduced || !visible || document.hidden) return;
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    /** A still frame: let the flock settle off-screen, then draw it once. */
    const settle = () => {
      for (let i = 0; i < 260; i++) step();
      draw();
    };

    readColour();
    resize();
    if (reduced) settle();
    else start();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || pausedRef.current) draw();
    });
    ro.observe(canvas);
    ro.observe(copy);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const themeObserver = new MutationObserver(() => {
      readColour();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onMotionChange = () => {
      reduced = motionQuery.matches;
      setStill(reduced);
      if (reduced) settle();
      else start();
    };
    motionQuery.addEventListener("change", onMotionChange);

    // The canvas sits behind the words, so listen on the hero itself.
    const hero = canvas.parentElement!;
    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    hero.addEventListener("pointermove", toLocal, { passive: true });
    hero.addEventListener("pointerdown", toLocal, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointerup", (e) => {
      if (e.pointerType !== "mouse") onLeave();
    });
    hero.addEventListener("pointercancel", onLeave);

    // A burst: every boid turns away from the words at full speed, then the
    // ordinary rules gather them again.
    const onScatter = () => {
      const cx = (avoid.x0 + avoid.x1) / 2;
      const cy = (avoid.y0 + avoid.y1) / 2;
      for (const b of boids) {
        const dx = b.x - cx;
        const dy = b.y - cy;
        const l = Math.sqrt(dx * dx + dy * dy) || 1;
        b.vx = (dx / l) * RULES.moveSpeed;
        b.vy = (dy / l) * RULES.moveSpeed;
      }
      start();
    };
    window.addEventListener(FLOCK_SCATTER_EVENT, onScatter);

    (canvas as HTMLCanvasElement & { __resume?: () => void }).__resume = start;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      hero.removeEventListener("pointermove", toLocal);
      hero.removeEventListener("pointerdown", toLocal);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointercancel", onLeave);
      window.removeEventListener(FLOCK_SCATTER_EVENT, onScatter);
    };
  }, []);

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (!next) {
      (canvasRef.current as (HTMLCanvasElement & { __resume?: () => void }) | null)?.__resume?.();
    }
  };

  return (
    <section className={`hero ${className}`} aria-labelledby={labelledBy}>
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="frame hero__body">
        <div ref={copyRef} className="hero__copy">
          {children}
        <div className="flock-readout hero-fade" style={{ "--i": 4 } as CSSProperties}>
          {showRules && (
          <dl aria-label="Flock rules">
            <div>
              <dt>Boids</dt>
              <dd>{count ?? 100}</dd>
            </div>
            <div>
              <dt>Alignment</dt>
              <dd>{RULES.alignment}</dd>
            </div>
            <div>
              <dt>Cohesion</dt>
              <dd>{RULES.cohesion}</dd>
            </div>
            <div>
              <dt>Separation</dt>
              <dd>{RULES.separation}</dd>
            </div>
          </dl>
          )}
          {readout.source && readout.sourceHref && (
            <span>
              <a className="link" href={readout.sourceHref} target="_blank" rel="noopener noreferrer">
                {readout.source}
              </a>
            </span>
          )}
          {!still && (
            <button type="button" onClick={togglePause} aria-pressed={paused}>
              {paused ? readout.play : readout.pause}
            </button>
          )}
        </div>
        </div>
      </div>
    </section>
  );
};
