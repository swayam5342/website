"use client";

import type { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/** Routes that render on their own, without the site's navbar and footer.
 *  App Router allows a single root layout, so the chrome is gated here
 *  rather than split across route groups. */
const BARE_ROUTES = ["/speed"];

export const SiteShell: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  if (BARE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">{children}</main>
      <Footer />
    </div>
  );
};
