"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TypingSample } from "@/types";
import s from "./speed.module.css";

interface Geometry {
  x: (i: number) => number;
  y: (v: number) => number;
  count: number;
  padLeft: number;
  plotWidth: number;
}

/** Speed over the course of the test: net WPM, raw WPM, and an x per
 *  second that contained an error. Canvas, redrawn on resize and theme. */
export function ResultsChart({ samples }: { samples: TypingSample[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geometryRef = useRef<Geometry | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  const draw = useCallback(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;

    const width = box.clientWidth;
    const height = box.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const g = canvas.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, width, height);

    if (samples.length === 0) {
      geometryRef.current = null;
      return;
    }

    // Custom properties inherit, so the canvas sees the test's palette.
    const styles = getComputedStyle(canvas);
    const color = (name: string) => styles.getPropertyValue(name).trim();

    const pad = { l: 38, r: 10, t: 14, b: 26 };
    const count = samples.length;
    const peak = Math.max(20, ...samples.map((p) => Math.max(p.wpm, p.raw)));
    const top = Math.ceil(peak / 20) * 20;
    const plotWidth = width - pad.l - pad.r;
    const plotHeight = height - pad.t - pad.b;

    const x = (i: number) =>
      pad.l + (count === 1 ? plotWidth / 2 : (i * plotWidth) / (count - 1));
    const y = (v: number) => pad.t + (1 - v / top) * plotHeight;

    geometryRef.current = { x, y, count, padLeft: pad.l, plotWidth };

    g.font = "11px ui-monospace, monospace";
    g.lineWidth = 1;

    for (let k = 0; k <= 4; k++) {
      const value = (top / 4) * k;
      g.strokeStyle = color("--sub-2");
      g.beginPath();
      g.moveTo(pad.l, y(value));
      g.lineTo(width - pad.r, y(value));
      g.stroke();

      g.fillStyle = color("--sub");
      g.textAlign = "right";
      g.textBaseline = "middle";
      g.fillText(String(Math.round(value)), pad.l - 8, y(value));
    }

    g.textAlign = "center";
    g.textBaseline = "top";
    const step = Math.max(1, Math.ceil(count / 10));
    samples.forEach((p, i) => {
      if (i % step === 0 || i === count - 1) {
        g.fillText(String(Math.round(p.second)), x(i), height - pad.b + 8);
      }
    });

    const line = (values: number[], stroke: string, lineWidth: number) => {
      g.strokeStyle = stroke;
      g.lineWidth = lineWidth;
      g.lineJoin = "round";
      g.lineCap = "round";
      g.beginPath();
      values.forEach((v, i) => (i ? g.lineTo(x(i), y(v)) : g.moveTo(x(i), y(v))));
      if (count === 1) g.lineTo(x(0) + 0.1, y(values[0]));
      g.stroke();
    };

    line(samples.map((p) => p.raw), color("--sub"), 1.6);
    line(samples.map((p) => p.wpm), color("--main"), 2.6);

    g.strokeStyle = color("--err");
    g.lineWidth = 2;
    samples.forEach((p, i) => {
      if (!p.errors) return;
      const cx = x(i);
      const cy = y(p.raw);
      const r = 3.5;
      g.beginPath();
      g.moveTo(cx - r, cy - r);
      g.lineTo(cx + r, cy + r);
      g.moveTo(cx + r, cy - r);
      g.lineTo(cx - r, cy + r);
      g.stroke();
    });
  }, [samples]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  // Redraw when the site theme changes, so the lines follow the palette.
  useEffect(() => {
    const observer = new MutationObserver(() => draw());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [draw]);

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const geometry = geometryRef.current;
    if (!geometry) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const i =
      geometry.count === 1
        ? 0
        : Math.round(
            ((mx - geometry.padLeft) / geometry.plotWidth) * (geometry.count - 1)
          );

    if (i < 0 || i >= geometry.count) {
      setTip(null);
      return;
    }

    const p = samples[i];
    setTip({
      x: geometry.x(i),
      y: geometry.y(Math.max(p.wpm, p.raw)),
      text: `${Math.round(p.second)}s  ${Math.round(p.wpm)} wpm  ${Math.round(p.raw)} raw  ${p.errors} err`,
    });
  };

  return (
    <div>
      <div className={s.chartBox} ref={boxRef}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Speed over the course of the test"
          onMouseMove={onMove}
          onMouseLeave={() => setTip(null)}
        />
        {tip && (
          <div className={s.tip} style={{ left: tip.x, top: tip.y }}>
            {tip.text}
          </div>
        )}
      </div>

      <div className={s.legend}>
        <span>
          <i style={{ background: "var(--main)" }} />
          wpm
        </span>
        <span>
          <i style={{ background: "var(--sub)" }} />
          raw
        </span>
        <span>
          <i style={{ background: "var(--err)" }} />
          errors
        </span>
      </div>
    </div>
  );
}
