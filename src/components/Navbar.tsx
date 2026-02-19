
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'CERTIFICATES', path: '/certificates' },
    { name: 'RESUME', path: '/resume' },
  ];

  const activeClass = "text-brand-accent border-b border-brand-accent";
  const inactiveClass = "text-brand-muted hover:text-brand-accent border-b border-transparent";

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-bg/90 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-brand-accent p-1 text-brand-bg">
            </div>
            <span className="font-mono font-bold tracking-tight text-sm flex flex-col leading-none">
              <span>SWAYAM</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `font-mono text-sm font-medium transition-all py-1 ${isActive ? activeClass : inactiveClass}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

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
