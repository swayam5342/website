import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Maximize2 } from "lucide-react";
import certificatesData from "@/src/data/certificates";
import type { Certificate } from "@/types";

export function generateStaticParams() {
  return (certificatesData as Certificate[]).map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cert = (certificatesData as Certificate[]).find((c) => c.id === Number(id));

  if (!cert) return {};

  const description = `${cert.name} — issued by ${cert.issuer} (${cert.year}).`;

  return {
    title: cert.name,
    description,
    alternates: { canonical: `/certificates/${cert.id}` },
    openGraph: {
      title: cert.name,
      description,
      url: `/certificates/${cert.id}`,
    },
  };
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
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 flex flex-col h-[calc(100vh-120px)]">
      <Link
        href="/certificates"
        className="group mb-6 inline-flex w-fit items-center gap-2 text-sm text-brand-muted transition-colors hover:text-brand-text"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>All certificates</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="display text-4xl md:text-5xl">{cert.name}</h1>
          <p className="eyebrow mt-3">{cert.issuer} · {cert.year}</p>
        </div>

        <div className="flex items-center space-x-3">
          <a href={cert.file} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <Maximize2 size={16} />
            <span>Fullscreen</span>
          </a>
          <a href={cert.file} download className="btn btn-solid">
            <Download size={16} />
            <span>Download</span>
          </a>
        </div>
      </div>

      <div className="flex-grow bg-brand-surface border border-brand-border overflow-hidden relative">
        <iframe
          src={`${cert.file}#toolbar=0&navpanes=0`}
          className="w-full h-full border-none"
          title={cert.name}
        />
        <div className="absolute bottom-4 right-4 bg-brand-bg/80 backdrop-blur px-3 py-1.5 eyebrow pointer-events-none md:hidden">
          Use two fingers to scroll
        </div>
      </div>
    </div>
  );
}
