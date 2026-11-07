"use client";

import { useState } from "react";
import { Download, Maximize2 } from "lucide-react";
import resumesData from "@/src/data/resumes";
import { DocPreview } from "@/src/components/DocPreview";
import type { ResumeData } from "@/types";

const VERSIONS: { id: keyof ResumeData; label: string }[] = [
  { id: "default", label: "General" },
  { id: "security", label: "Security" },
  { id: "backend", label: "Backend" },
];

/**
 * The resume in the browser's own PDF viewer, as before, in an A4 frame.
 * Phones (Android Chrome in particular) show nothing for a PDF inside a page,
 * so below 40rem the frame gives way to a picture of the page that opens the PDF.
 */
export default function ResumeView() {
  const [active, setActive] = useState<keyof ResumeData>("default");
  const data = resumesData as ResumeData;
  const file = data[active];
  // Only offer a choice when the versions are actually different files.
  const distinct = new Set(VERSIONS.map((v) => data[v.id])).size > 1;

  return (
    <div className="frame doc">
      <header className="doc__head">
        <div className="doc__title">
          <h1 className="t-display">Resume</h1>
          <p className="t-lead measure">Read it here, open it full size, or download the PDF.</p>
          {distinct && (
            <div className="filters" role="radiogroup" aria-label="Resume version">
              {VERSIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  className="chip"
                  aria-checked={active === v.id}
                  onClick={() => setActive(v.id)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="doc__actions">
          <a className="go" data-external href={file} target="_blank" rel="noopener noreferrer">
            <Maximize2 size={16} aria-hidden="true" />
            Open full size
          </a>
          <a className="btn" href={file} download>
            <Download size={18} aria-hidden="true" />
            Download
          </a>
        </div>
      </header>

      <div className="viewer" data-reveal>
        <div className="viewer__frame">
          <iframe
            key={active}
            src={`${file}#toolbar=0&navpanes=0&view=FitH`}
            title="Resume (PDF)"
            loading="lazy"
          />
        </div>
        <div className="viewer__phone">
          <DocPreview key={active} file={file} title="Resume" alt="The first page of Swayam's resume." />
        </div>
      </div>
      <p className="muted t-small doc__fallback">
        If the resume does not show here,{" "}
        <a className="link" href={file}>
          open the PDF
        </a>
        .
      </p>
    </div>
  );
}
