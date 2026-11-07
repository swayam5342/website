import type { Metadata } from "next";
import siteData from "@/src/data/site";
import { PageTransition } from "@/src/components/PageTransition";
import ResumeView from "./ResumeView";

const description = "Swayam's resume, to read here or download as a PDF.";

export const metadata: Metadata = {
  title: "Resume",
  description,
  alternates: { canonical: "/resume" },
  openGraph: {
      images: [{ url: siteData.ogImage }],
    title: "Resume",
    description,
    url: "/resume",
  },
};

export default function Resume() {
  return (
    <PageTransition>
      <ResumeView />
    </PageTransition>
  );
}
