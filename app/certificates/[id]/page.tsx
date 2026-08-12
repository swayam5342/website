import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Maximize2 } from "lucide-react";
import certificatesData from "@/src/data/certificates";
import type { Certificate } from "@/types";

export function generateStaticParams() {
  return (certificatesData as Certificate[]).map((c) => ({ id: String(c.id) }));
}

export default async function CertificateDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = (certificatesData as Certificate[]).find((c) => c.id === Number(id));

  if (!cert) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col h-[calc(100vh-120px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Link href="/certificates" className="p-2 hover:bg-white/5 rounded-full transition-colors text-brand-muted hover:text-brand-accent">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{cert.name}</h1>
            <p className="text-sm text-brand-muted">{cert.issuer} • {cert.year}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a href={cert.file} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-brand-surface border border-white/10 px-4 py-2 rounded-lg text-sm font-bold hover:border-brand-accent/50 transition-all">
            <Maximize2 size={16} />
            <span>Fullscreen</span>
          </a>
          <a href={cert.file} download className="flex items-center space-x-2 bg-brand-accent text-brand-bg px-4 py-2 rounded-lg text-sm font-bold hover:scale-[1.02] transition-all">
            <Download size={16} />
            <span>Download</span>
          </a>
        </div>
      </div>

      <div className="flex-grow bg-brand-surface rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
        <iframe
          src={`${cert.file}#toolbar=0&navpanes=0`}
          className="w-full h-full border-none"
          title={cert.name}
        />
        <div className="absolute bottom-4 right-4 bg-brand-bg/80 backdrop-blur px-3 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-widest text-brand-muted pointer-events-none md:hidden">
          Use two fingers to scroll
        </div>
      </div>
    </div>
  );
}
