import React, { useState } from "react";
import { Download, Maximize2, ChevronDown } from "lucide-react";
import resumesData from "../data/resumes";
import { ResumeData } from "../types";

export const Resume: React.FC = () => {
  const versions = [
    { id: "default", label: "GEN SYSTEMS" },
    { id: "security", label: "CYBER" },
    { id: "backend", label: "BACKEND" }
  ];

  const [activeVersion, setActiveVersion] =
    useState<keyof ResumeData>("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentFile = (resumesData as ResumeData)[activeVersion];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col min-h-[calc(100vh-80px)]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-8 md:space-y-0 border-b border-brand-border pb-8">
        <div>
          <h1 className="text-4xl font-mono font-bold tracking-tighter uppercase">
            Doc // Resume
          </h1>
          <p className="text-brand-muted mt-2 font-mono text-[10px] uppercase tracking-widest">
            Select relevant schema for targeted assessment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {/* Version Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-56 px-4 py-3 bg-brand-surface border border-brand-border text-left text-[10px] font-mono font-bold hover:border-brand-accent transition-all uppercase tracking-widest"
            >
              <span>
                {versions.find((v) => v.id === activeVersion)?.label}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 top-full mt-1 w-full bg-brand-surface border border-brand-border shadow-2xl overflow-hidden py-1">
                {versions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveVersion(v.id as keyof ResumeData);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[9px] font-mono uppercase tracking-widest hover:bg-brand-accent hover:text-brand-bg transition-colors ${
                      activeVersion === v.id
                        ? "text-brand-accent bg-white/5"
                        : "text-brand-muted"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <a
              href={currentFile}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-accent transition-all"
              title="Fullscreen"
            >
              <Maximize2 size={16} />
            </a>

            <a
              href={currentFile}
              download
              className="flex items-center space-x-4 bg-brand-accent text-brand-bg px-8 py-3 font-mono text-[10px] font-bold hover:bg-brand-muted transition-all uppercase tracking-widest"
            >
              <Download size={14} />
              <span>SAVE_DOCUMENT</span>
            </a>
          </div>
        </div>
      </div>

<div className="flex-1 flex justify-center items-start pt-6">
  
  {/* A4 sized container */}
  <div className="w-full max-w-3xl aspect-[1/1.414] bg-[#111111] border border-brand-border shadow-2xl relative">
    
  <iframe
    src={`${currentFile}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
    className="w-full h-full border-none"
    title="Resume Viewer"
    key={activeVersion}
    toolbar={"0"}
    />

  </div>
</div>
    </div>
  );
};
