"use client";

import type { FC } from "react";
import { useEffect, useRef } from "react";

/**
 * A muted screen recording that plays while it is on screen and pauses when
 * it is not. With reduced motion it never starts by itself; the controls
 * are always there. Nothing is downloaded until it first comes near view.
 */
export const AutoVideo: FC<{ src: string; poster?: string; width: number; height: number; label: string }> = ({
  src,
  poster,
  width,
  height,
  label,
}) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          if (!reduced) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      controls
      preload="none"
      aria-label={label}
      style={{ aspectRatio: `${width} / ${height}`, objectFit: "cover" }}
    />
  );
};
