import type { Metadata } from "next";
import ResumeView from "./ResumeView";

const description = "Select a targeted resume schema — general systems, cybersecurity, or backend — and view or download the PDF.";

export const metadata: Metadata = {
  title: "Resume",
  description,
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Resume",
    description,
    url: "/resume",
  },
};

export default function Resume() {
  return <ResumeView />;
}
