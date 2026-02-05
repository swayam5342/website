import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 border-t border-brand-border bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left: Name / Copyright */}
        <p className="text-xs font-mono text-brand-muted uppercase tracking-widest">
          © {currentYear} SWAYAM PRAKASH
        </p>

        {/* Right: Contacts */}
        <div className="flex items-center gap-6">
          
          <a
            href="mailto:swayamsb50@gmail.com"
            className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition"
          >
            <Mail size={16} />
            <span className="text-xs font-mono">EMAIL</span>
          </a>

          <a
            href="https://github.com/swayam5342"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition"
          >
            <Github size={16} />
            <span className="text-xs font-mono">GITHUB</span>
          </a>

          <a
            href="https://linkedin.com/in/swayam5342"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition"
          >
            <Linkedin size={16} />
            <span className="text-xs font-mono">LINKEDIN</span>
          </a>

        </div>
      </div>
    </footer>
  );
};
