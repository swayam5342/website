import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Palette, Check } from "lucide-react";
import { useTheme, THEMES } from "../hooks/useTheme";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

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
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "PROJECTS", path: "/projects" },
    { name: "SKILLS", path: "/skills" },
    { name: "CERTIFICATES", path: "/certificates" },
    { name: "RESUME", path: "/resume" },
  ];

  const activeClass =
    "text-brand-accent border-b border-brand-accent";

  const inactiveClass =
    "text-brand-muted hover:text-brand-accent border-b border-transparent";

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-bg/90 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
{/* Logo */}
<Link to="/" className="flex items-center space-x-3">
  <img
    src="/Namelogo.png"
    alt="Swayam Logo"
    className="w-10 h-10 object-contain"
    width="2000"
    height="2000"
  />
  <span className="font-mono font-bold tracking-tight text-sm">
    SWAYAM
  </span>
</Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `font-mono text-sm font-medium transition-all py-1 ${
                    isActive ? activeClass : inactiveClass
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">

            {/* Theme Picker */}
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setPickerOpen((o) => !o)}
                className={`transition-all p-1 ${
                  pickerOpen
                    ? "text-brand-accent"
                    : "text-brand-muted hover:text-brand-accent"
                }`}
                aria-label="Select theme"
                aria-expanded={pickerOpen}
              >
                <Palette size={18} />
              </button>

              {pickerOpen && (
                <div className="absolute right-0 top-full mt-3 w-44 border border-brand-border bg-brand-bg shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)]">
                  <p className="px-4 pt-3 pb-2 font-mono text-[8px] text-brand-muted uppercase tracking-widest border-b border-brand-border">
                    COLOR_SCHEME
                  </p>
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setPickerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 font-mono text-[10px] tracking-widest transition-colors ${
                        theme === t.id
                          ? "text-brand-accent bg-brand-accent/10"
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
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-brand-muted hover:text-brand-accent p-1"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-bg border-b border-brand-border px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block font-mono text-sm text-brand-muted hover:text-brand-accent"
            >
              {`> ${link.name}`}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};