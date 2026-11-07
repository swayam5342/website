import type { Metadata, Viewport } from "next";
import type React from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteShell } from "@/src/components/SiteShell";
import homeData from "@/src/data/home";
import siteData from "@/src/data/site";
import { themeInitScript } from "@/src/lib/themes";
import "./globals.css";

/*
 * Three families, self-hosted by next/font at build time (no request to
 * Google from the browser):
 *   Instrument Serif  headings
 *   IBM Plex Sans     everything you read
 *   IBM Plex Mono     only the terminal, code excerpts and the typing test
 */
const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--ff-serif",
});

const sans = IBM_Plex_Sans({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--ff-sans",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--ff-mono",
});

const description = homeData.description;

export const metadata: Metadata = {
  metadataBase: new URL(siteData.url),
  title: {
    default: siteData.title,
    template: siteData.titleTemplate,
  },
  description,
  icons: {
    icon: "/Namelogo.png",
  },
  openGraph: {
    type: "website",
    url: siteData.url,
    siteName: siteData.name,
    title: siteData.title,
    description,
    images: [{ url: siteData.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.title,
    description,
    images: [siteData.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#dfdedb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="stone"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies a saved theme before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
