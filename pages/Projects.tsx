import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Github, ExternalLink, ChevronRight } from "lucide-react";
import projectsData from "../data/projects";
import project from "../data/projects.json"
import categorie from "../data/project_cat.json";
import { Project } from "../types";

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const categories = categorie as string[];

  const filteredProjects = (projectsData as Project[])
    .filter((p) => {
      if (filter === "All") return true;
      return p.tags.includes(filter);
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <div className="max-w-7xl mx-auto px-4">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-brand-border pb-8">
        <div>
          <h1 className="text-4xl font-mono font-bold tracking-tighter uppercase">
            {project.main_heading}
          </h1>
          <p className="text-brand-muted mt-2 font-mono text-[10px] uppercase tracking-widest">
            {project.sub_heading}
          </p>
        </div>

        <div className="mt-8 md:mt-0 flex border border-brand-border p-1 bg-brand-surface">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 font-mono text-[9px] uppercase transition-all ${
                filter === cat
                  ? "bg-brand-accent text-brand-bg font-bold"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="group bg-brand-bg border border-brand-border p-12 relative flex flex-col hover:bg-brand-surface transition-colors"
          >
            <div className="absolute top-4 right-4 font-mono text-[7px] opacity-10 uppercase tracking-[0.2em]">
              Hash::SHA256
            </div>

            <div className="flex items-center space-x-4 mb-8">
              <span className="w-0.5 h-10 bg-brand-accent"></span>

              <div>
                {/* Title clickable to GitHub */}
                {p.github ? (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-bold font-mono hover:underline"
                  >
                    {p.title}
                  </a>
                ) : (
                  <h3 className="text-2xl font-bold font-mono">{p.title}</h3>
                )}

                <div className="flex gap-2 mt-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[8px] font-mono bg-white text-black border border-white px-2 py-0.5 uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-brand-muted leading-relaxed mb-12 flex-grow font-sans">
              {p.description}
            </p>

            <div className="flex items-center justify-between border-t border-brand-border pt-8">
              <Link
                to={`/projects/${p.slug}`}
                className="flex items-center text-[10px] font-mono text-brand-accent hover:underline tracking-widest"
              >
                [DEEP_INSPECT] <ChevronRight size={12} className="ml-1" />
              </Link>

              <div className="flex space-x-5 text-brand-muted">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-accent"
                  >
                    <Github size={20} />
                  </a>
                )}
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-accent"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
