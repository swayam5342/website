import type { Metadata } from "next";
import ContactView from "./ContactView";

const description = "Reach out for collaborations, roles, or just to talk shop — open to backend, security, and infrastructure roles.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact",
    description,
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactView />;
}
