import type { Metadata } from "next";
import siteData from "@/src/data/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import certificatesData from "@/src/data/certificates";
import { PageTransition } from "@/src/components/PageTransition";
import { DocPreview } from "@/src/components/DocPreview";
import type { Certificate } from "@/types";

export function generateStaticParams() {
  return (certificatesData as Certificate[]).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cert = (certificatesData as Certificate[]).find((c) => c.slug === slug);
  if (!cert) return {};

  const description = `Swayam's ${cert.name} certificate, issued by ${cert.issuer} in ${cert.year}. View it here or download the PDF.`;
  return {
    title: cert.name,
    description,
    alternates: { canonical: `/certificates/${cert.slug}` },
    openGraph: {
      images: [{ url: siteData.ogImage }], title: cert.name, description, url: `/certificates/${cert.slug}` },
  };
}

export default async function CertificateDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cert = (certificatesData as Certificate[]).find((c) => c.slug === slug);
  if (!cert) notFound();
  const hasVerify = cert.verify && cert.verify.trim() !== "";

  return (
    <PageTransition>
      <div className="frame doc">
        <p className="study__back">
          <Link href="/about#certificates" className="go" transitionTypes={["nav-back"]}>
            <ArrowLeft size={16} aria-hidden="true" />
            All certificates
          </Link>
        </p>
        <header className="doc__head">
          <div>
            <h1 className="t-h2">{cert.name}</h1>
            <p className="muted">
              {cert.issuer}, <span className="tabular">{cert.year}</span>
            </p>
          </div>
          <div className="doc__actions">
            {hasVerify && (
              <a className="go" data-external href={cert.verify} target="_blank" rel="noopener noreferrer">
                Verify with {cert.issuer}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
            <a className="go" data-external href={cert.file} target="_blank" rel="noopener noreferrer">
              Open the PDF
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a className="btn" href={cert.file} download>
              <Download size={18} aria-hidden="true" />
              Download
            </a>
          </div>
        </header>
        <DocPreview
          file={cert.file}
          title={`${cert.name} certificate`}
          alt={`The ${cert.name} certificate issued to Swayam by ${cert.issuer} in ${cert.year}.`}
          priority
        />
        <p className="muted t-small doc__fallback">
          Select the certificate to open the PDF{hasVerify ? `, or verify it with ${cert.issuer}` : ""}.
        </p>
      </div>
    </PageTransition>
  );
}
