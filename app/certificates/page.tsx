import type { Metadata } from "next";
import Link from "next/link";
import { Eye, ShieldCheck } from "lucide-react";
import certificatesData from "@/src/data/certificates";
import { IconBadge } from "@/src/components/IconBadge";
import { PageHeader } from "@/src/components/PageHeader";
import type { Certificate } from "@/types";

const description = "Validated certification data and identity proofs.";

export const metadata: Metadata = {
  title: "Certificates",
  description,
  alternates: { canonical: "/certificates" },
  openGraph: {
    title: "Certificates",
    description,
    url: "/certificates",
  },
};

export default function Certificates() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <PageHeader
        eyebrow="Verified achievements"
        title="Certificates"
        description={description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(certificatesData as Certificate[]).map((cert) => {
          const hasVerify = cert.verify && cert.verify.trim() !== "";

          return (
            <div key={cert.id} className="card flex flex-col p-8">
              {/* Top Row */}
              <div className="flex items-start justify-between mb-12">
                <IconBadge icon={cert.icon} />
                <span className="eyebrow">{cert.year}</span>
              </div>

              {/* Title + Issuer */}
              <div className="flex-grow space-y-3">
                {hasVerify ? (
                  <a
                    href={cert.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="display text-2xl leading-tight hover:text-brand-accent transition-colors"
                  >
                    {cert.name}
                  </a>
                ) : (
                  <Link
                    href={`/certificates/${cert.id}`}
                    className="display text-2xl leading-tight hover:text-brand-accent transition-colors"
                  >
                    {cert.name}
                  </Link>
                )}
                <p className="text-sm text-brand-muted">{cert.issuer}</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 mt-10">
                <Link
                  href={`/certificates/${cert.id}`}
                  className="btn btn-ghost justify-center !px-4 !py-2.5 text-xs"
                >
                  <Eye size={12} />
                  <span>Inspect</span>
                </Link>

                {hasVerify ? (
                  <a
                    href={cert.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-solid justify-center !px-4 !py-2.5 text-xs"
                  >
                    <ShieldCheck size={12} />
                    <span>Verify</span>
                  </a>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
