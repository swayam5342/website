import type { Metadata } from "next";
import aboutjson from "@/src/data/about";
import AboutView from "./AboutView";

export const metadata: Metadata = {
  title: "About",
  description: aboutjson.main_text,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About",
    description: aboutjson.main_text,
    url: "/about",
  },
};

export default function AboutPage() {
  return <AboutView />;
}
