import React from "react";
import { Link } from "react-router-dom";
import { Eye, ShieldCheck } from "lucide-react";
import certificatesData from "../data/certificates";
import { Certificate } from "../types";

export const Certificates: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <header className="mb-16 border-b border-brand-border pb-8">
        <h1 className="text-4xl font-mono font-bold tracking-tighter uppercase">
          CERTIFICATES // VERIFIED ACHIEVEMENTS
        </h1>
        <p className="text-brand-muted mt-2 font-mono text-[10px] uppercase tracking-widest">
          Validated certification data and identity proofs.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(certificatesData as Certificate[]).map((cert) => {
          const hasVerify = cert.verify && cert.verify.trim() !== "";

          return (
            <div
              key={cert.id}
              className="group bg-brand-bg p-10 flex flex-col border border-brand-border hover:bg-brand-surface transition-all"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-10">
                <span className="text-[8px] font-mono text-brand-muted border border-brand-border px-2 py-0.5">
                  CERT {cert.id}
                </span>
                <span className="text-[10px] font-mono font-bold text-brand-accent">
                  {cert.year}
                </span>
              </div>

              {/* Title + Issuer */}
              <div className="flex-grow space-y-4">
                {hasVerify ? (
                  <a
                    href={cert.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold font-mono tracking-tight leading-tight hover:underline"
                  >
                    {cert.name}
                  </a>
                ) : (
                  <Link
                    to={`/certificates/${cert.id}`}
                    className="text-xl font-bold font-mono tracking-tight leading-tight hover:underline"
                  >
                    {cert.name}
                  </Link>
                )}

<p className="w-fit mt-2 text-[10px] font-mono bg-white text-black uppercase border border-white px-2 py-0.5 tracking-widest">
  {cert.issuer}
</p>

              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 mt-12">
                <Link
                  to={`/certificates/${cert.id}`}
                  className="flex items-center justify-center space-x-2 text-[10px] font-mono font-bold py-4 border border-brand-border text-brand-accent hover:bg-brand-accent hover:text-brand-bg transition-all uppercase tracking-widest"
                >
                  <Eye size={12} />
                  <span>INSPECT</span>
                </Link>

                {hasVerify ? (
                  <a
                    href={cert.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 text-[10px] font-mono py-4 border border-brand-border text-brand-muted hover:text-brand-accent transition-all uppercase tracking-widest"
                  >
                    <ShieldCheck size={12} />
                    <span>VERIFY</span>
                  </a>
                ) : (
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 text-[10px] font-mono py-4 border border-brand-border text-brand-muted hover:text-brand-accent transition-all uppercase tracking-widest"
                  >
                    <ShieldCheck size={12} />
                    <span>OPEN</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
