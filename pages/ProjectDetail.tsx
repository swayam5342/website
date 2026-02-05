
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Github, Globe, ShieldCheck, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import projectsData from '../data/projects';
import { Project } from '../types';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = (projectsData as Project[]).find(p => p.slug === slug);

  if (!project) return <Navigate to="/projects" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/projects" className="inline-flex items-center space-x-2 text-brand-muted hover:text-brand-accent transition-colors mb-8 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Projects</span>
      </Link>

      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(t => (
            <span key={t} className="text-xs font-mono uppercase px-3 py-1 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent">{t}</span>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
        <p className="text-xl text-brand-muted leading-relaxed">{project.description}</p>
        
        <div className="flex items-center space-x-4 mt-8">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-brand-surface border border-white/10 px-5 py-2.5 rounded-lg font-bold hover:border-brand-accent/50 transition-all">
              <Github size={18} />
              <span>Repository</span>
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-brand-accent text-brand-bg px-5 py-2.5 rounded-lg font-bold hover:scale-[1.02] transition-all">
              <Globe size={18} />
              <span>Live System</span>
            </a>
          )}
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <Layers className="text-brand-accent" />
            <span>Architecture Overview</span>
          </h2>
          <div className="p-6 bg-brand-surface rounded-2xl border border-white/5 text-brand-muted leading-relaxed">
            {project.details?.architecture}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <AlertCircle className="text-brand-accent" />
            <span>Key Challenges</span>
          </h2>
          <div className="p-6 bg-brand-surface rounded-2xl border border-white/5 text-brand-muted leading-relaxed">
            {project.details?.challenges}
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-5 -mr-10 -mt-10">
            <ShieldCheck size={200} />
          </div>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <ShieldCheck className="text-brand-accent" />
            <span>Security Considerations</span>
          </h2>
          <div className="p-6 bg-brand-accent/5 rounded-2xl border border-brand-accent/20 text-brand-muted leading-relaxed backdrop-blur-sm">
            {project.details?.security}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <RefreshCw className="text-brand-accent" />
            <span>Future Improvements</span>
          </h2>
          <div className="p-6 bg-brand-surface rounded-2xl border border-white/5 text-brand-muted leading-relaxed">
            {project.details?.improvements}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Technical Impact</h2>
          <ul className="space-y-4">
            {project.resume_points.map((point, i) => (
              <li key={i} className="flex items-start space-x-3 text-brand-muted">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
