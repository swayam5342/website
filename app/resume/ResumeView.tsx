"use client";

import { useState } from "react";
import { Download, Maximize2, ChevronDown } from "lucide-react";
import resumesData from "@/src/data/resumes";
import { PageHeader } from "@/src/components/PageHeader";
import type { ResumeData } from "@/types";

export default function ResumeView() {
  const versions = [
    { id: "default", label: "General systems" },
    { id: "security", label: "Cybersecurity" },
    { id: "backend", label: "Backend" },
  ];

  const [activeVersion, setActiveVersion] =
    useState<keyof ResumeData>("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentFile = (resumesData as ResumeData)[activeVersion];

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 flex flex-col">
      <PageHeader
        eyebrow="Curriculum vitae"
        title="Resume"
        description="Select the version that fits the role you have in mind."
        aside={
          <div className="flex flex-wrap items-center gap-3">
            {/* Version Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-ghost w-52 justify-between cursor-pointer"
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
                <div className="absolute z-50 top-full mt-2 w-full overflow-hidden border border-brand-border bg-brand-bg py-1">
                  {versions.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setActiveVersion(v.id as keyof ResumeData);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-brand-surface ${
                        activeVersion === v.id
                          ? "text-brand-text"
                          : "text-brand-muted"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href={currentFile}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost !px-3"
              title="Fullscreen"
              aria-label="Open fullscreen"
            >
              <Maximize2 size={16} />
            </a>

            <a href={currentFile} download className="btn btn-solid">
              <Download size={14} />
              <span>Download</span>
            </a>
          </div>
        }
      />

      <div className="flex-1 flex justify-center items-start">
        {/* A4 sized container */}
        <div className="w-full max-w-3xl aspect-[1/1.414] overflow-hidden border border-brand-border bg-brand-surface">
          <iframe
            src={`${currentFile}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full border-none"
            title="Resume Viewer"
            key={activeVersion}
          />
        </div>
      </div>
    </div>
  );
}
