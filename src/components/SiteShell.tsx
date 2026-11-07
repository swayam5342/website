"use client";

import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { TerminalPalette } from "./TerminalPalette";

/** Routes that render on their own, without the site's navbar and footer.
 *  App Router allows a single root layout, so the chrome is gated here
 *  rather than split across route groups. */
const BARE_ROUTES = ["/speed"];

/**
 * Entrances: every element marked data-reveal has its children rise in, in
 * order, the first time it scrolls into view. Anything already on screen is
 * marked shown before hiding is switched on, so nothing flashes, and nothing
 * is hidden at all if this script never runs.
 */
const useReveal = (pathname: string) => {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.shown = "true";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    // Tracked per run, not on the element: a run that is being torn down
    // must not claim elements the next run needs to watch.
    const seen = new WeakSet<HTMLElement>();
    const setUp = (root: ParentNode) => {
      const vh = window.innerHeight;
      const sel = "[data-reveal]:not([data-shown])";
      const els = Array.from(root.querySelectorAll<HTMLElement>(sel));
      if (root instanceof HTMLElement && root.matches(sel)) els.push(root);
      for (const el of els) {
        if (seen.has(el)) continue;
        seen.add(el);
        Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(Math.min(i, 8))));
        // Anything already on screen (or above it) is shown at once.
        if (el.getBoundingClientRect().top < vh * 0.9) el.dataset.shown = "true";
        else io.observe(el);
      }
    };

    setUp(document);
    document.documentElement.classList.add("reveal-ready");

    // Content that arrives later (a Suspense boundary resolving, a filter
    // changing a list) is picked up too, so nothing stays hidden.
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof HTMLElement && setUp(n));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
};

export const SiteShell: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  useReveal(pathname);

  if (bare) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        {children}
      </main>
      <Footer />
      <TerminalPalette />
    </>
  );
};
