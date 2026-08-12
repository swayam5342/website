import type { Metadata } from "next";
import type React from "react";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import homeData from "@/src/data/home";
import siteData from "@/src/data/site";
import "./globals.css";

const description = homeData.main_text;

export const metadata: Metadata = {
  metadataBase: new URL(siteData.url),
  title: {
    default: siteData.name,
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
    title: siteData.name,
    description,
    images: [{ url: siteData.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.name,
    description,
    images: [siteData.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=JetBrains+Mono:wght@100;400;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow pt-24 pb-12">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
