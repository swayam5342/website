
import React from 'react';
import { Shield, Cpu, ArrowRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import projectsData from '../data/projects';
import homeData from '../data/home.json';
import experiencesData from '../data/experiences.json';
import { Experience } from '../../types';

export const Home: React.FC = () => {
  const featuredProjects = projectsData.filter(p => p.featured).slice(0, 2);
  const iconMap: any = {
  Shield: Shield,
  Cpu: Cpu,
  Github: Github
};
  const main_text = homeData.main_text;
  const recentExperiences = (experiencesData as Experience[]).slice(0, 2);
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-24">
      {/* Hero */}
      <section className="min-h-[60vh] flex flex-col justify-center border-l border-brand-border pl-8 relative">
        <div className="absolute top-0 left-[-3px] w-1.5 h-1.5 bg-brand-accent"></div>
        
        <div className="space-y-8">
          <div className="font-mono text-[10px] text-brand-muted flex items-center space-x-2 tracking-widest uppercase">
            <span className="inline-block w-1.5 h-1.5 bg-brand-accent"></span>
            <span>{homeData.main_heading}</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85]">
            Secure <br />
            Backend <br />
            <span className="text-brand-muted/20 hover:text-brand-accent transition-colors duration-500 cursor-default">Architect</span>
          </h1>
          
          <p className="max-w-lg text-brand-muted text-base leading-relaxed border-l border-brand-border pl-6 font-mono">
            {main_text}
          </p>

          <div className="flex flex-wrap gap-4 pt-6">
            <Link to="/projects" className="bg-brand-accent text-brand-bg px-8 py-3 font-mono text-xs font-bold flex items-center space-x-3 hover:bg-brand-muted transition-all">
              <span>{homeData.project}</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/certificates" className="border border-brand-border px-8 py-3 font-mono text-xs font-bold flex items-center space-x-3 hover:bg-white/5 transition-all">
              <span>CERTIFICATES</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Experience */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recentExperiences.map((exp) => (
          <div key={exp.id} className="p-8 border border-brand-border bg-brand-surface hover:bg-brand-accent hover:text-brand-bg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-brand-accent font-mono text-sm group-hover:text-brand-bg">{exp.period}</span>
            </div>
            <h3 className="text-xl font-mono font-bold text-brand-text group-hover:text-brand-bg mb-2">{exp.title}</h3>
            <p className="text-brand-accent font-mono text-sm mb-4 group-hover:text-brand-bg/90">{exp.company}</p>
            <p className="text-brand-muted text-sm leading-relaxed mb-6 font-sans group-hover:text-brand-bg/80 line-clamp-3">
              {exp.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {exp.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="bg-brand-accent/10 text-brand-accent px-2 py-1 text-xs font-mono group-hover:bg-brand-bg group-hover:text-brand-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Featured Projects Highlight */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <h2 className="font-mono text-[10px] font-bold tracking-widest text-brand-muted">LATEST_DEPLOYS.LOG</h2>
          <Link to="/projects" className="text-brand-accent text-[9px] font-mono hover:underline">EXTRACT_ALL_DATA</Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-brand-border">
          {featuredProjects.map((p) => (
            <Link key={p.id} to={`/projects/${p.slug}`} className="group block p-12 bg-brand-bg hover:bg-brand-surface transition-all">
              <div className="flex justify-between items-start mb-8">
                <span className="text-[9px] font-mono text-brand-muted border border-brand-border px-2 py-0.5">UID: {p.id}</span>
                <span className="text-[9px] font-mono text-brand-muted uppercase tracking-widest">{p.tags[0]}</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 font-mono group-hover:underline">{p.title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-10 line-clamp-2 font-sans">
                {p.description}
              </p>
              <div className="flex items-center text-[10px] font-mono text-brand-accent">
                <span>VIEW_TECHNICAL_DEBT</span>
                <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
