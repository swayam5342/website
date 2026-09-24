"use client";

import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Palette, Check } from "lucide-react";
import { useTheme, THEMES } from "../hooks/useTheme";

export const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    if (!pickerOpen) return;
    const close = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [pickerOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Skills", path: "/skills" },
    { name: "Certificates", path: "/certificates" },
    { name: "Resume", path: "/resume" },
    { name: "Contact", path: "/contact" },
  ];

  const activeClass = "text-brand-text border-b border-brand-text";

  const inactiveClass =
    "text-brand-muted hover:text-brand-text border-b border-transparent";

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-bg/85 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/Namelogo.png"
              alt="Swayam Logo"
              className="w-8 h-8 object-contain"
              width={32}
              height={32}
              priority
            />
            <span className="display text-2xl">Swayam</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm transition-colors py-1 ${
                  pathname === link.path ? activeClass : inactiveClass
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Picker */}
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setPickerOpen((o) => !o)}
                className={`transition-colors p-1 ${
                  pickerOpen
                    ? "text-brand-text"
                    : "text-brand-muted hover:text-brand-text"
                }`}
                aria-label="Select theme"
                aria-expanded={pickerOpen}
              >
                <Palette size={18} />
              </button>

              {pickerOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 overflow-hidden border border-brand-border bg-brand-bg">
                  <p className="eyebrow px-4 pt-3 pb-2 border-b border-brand-border">
                    Color scheme
                  </p>
                  <div className="max-h-72 overflow-y-auto">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setPickerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors ${
                          theme === t.id
                            ? "text-brand-text bg-brand-surface"
                            : "text-brand-muted hover:text-brand-text hover:bg-brand-surface"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="inline-flex w-4 h-4 border border-brand-border"
                            style={{ backgroundColor: t.swatch.bg }}
                          >
                            <span
                              className="w-1.5 h-1.5 m-auto"
                              style={{ backgroundColor: t.swatch.accent }}
                            />
                          </span>
                          {t.label}
                        </span>
                        {theme === t.id && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className="text-brand-muted hover:text-brand-text p-1"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-bg border-b border-brand-border px-6 py-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block display text-3xl ${
                pathname === link.path
                  ? "text-brand-text"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
