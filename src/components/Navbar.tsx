import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cycleTheme, isLight } = useTheme();

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

            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="text-brand-muted hover:text-brand-accent transition-all p-1"
              aria-label="Toggle Theme"
            >
              {isLight ? <Sun size={18} /> : <Moon size={18} />}
            </button>

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