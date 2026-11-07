"use client";

import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, SquareTerminal, X } from "lucide-react";
import { openTerminal } from "./TerminalPalette";

const NAV_LINKS = [
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Resume", path: "/resume" },
  { name: "Contact", path: "/contact" },
];

const isCurrent = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(`${path}/`);

/**
 * A plain bar: wordmark, four links, the terminal. It slides away while
 * you scroll down and comes back as soon as you scroll up.
 */
export const Navbar: FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (y < 80) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="site-header" data-hidden={hidden && !menuOpen}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="frame site-header__bar">
        <Link href="/" className="wordmark" aria-current={pathname === "/" ? "page" : undefined}>
          Swayam
        </Link>

        <nav className="site-nav" aria-label="Main">
          <ul className="site-nav__links">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="site-nav__link"
                  aria-current={isCurrent(pathname, link.path) ? "page" : undefined}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <button type="button" className="term-btn" onClick={openTerminal}>
            <SquareTerminal size={18} aria-hidden="true" />
            <span>Terminal</span>
            <kbd className="key" aria-hidden="true">
              /
            </kbd>
          </button>

          <button
            type="button"
            className="btn-text site-nav__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="menu-sheet"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div id="menu-sheet" className="menu-sheet">
          <ul>
            <li>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link href={link.path} aria-current={isCurrent(pathname, link.path) ? "page" : undefined}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};
