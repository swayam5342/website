import type { FC } from "react";
import Image from "next/image";
import previews from "@/src/data/pdf-previews.json";

type Preview = { src: string; width: number; height: number };

/**
 * A document shown as a picture of its first page, linking to the PDF.
 * Phones (Android Chrome in particular) render nothing for a PDF inside an
 * iframe, so the picture is the one view that works everywhere. Previews come
 * from `node scripts/pdf-previews.mjs`; until one exists the PDF is framed.
 */
export const DocPreview: FC<{ file: string; alt: string; title: string; priority?: boolean }> = ({
  file,
  alt,
  title,
  priority,
}) => {
  const preview = (previews as Record<string, Preview>)[file];

  if (!preview) {
    return (
      <div className="doc__frame doc__frame--a4">
        <iframe src={`${file}#toolbar=0&navpanes=0&view=FitH`} title={title} />
      </div>
    );
  }

  const portrait = preview.height > preview.width;
  return (
    <a
      href={file}
      className={`doc__preview ${portrait ? "doc__preview--portrait" : ""}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}: open the PDF (opens in a new tab)`}
    >
      <Image
        src={preview.src}
        width={preview.width}
        height={preview.height}
        alt={alt}
        sizes={portrait ? "(min-width: 56rem) 52rem, 100vw" : "(min-width: 90rem) 82rem, 100vw"}
        priority={priority}
        quality={90}
      />
    </a>
  );
};
