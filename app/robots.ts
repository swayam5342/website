import type { MetadataRoute } from "next";
import siteData from "@/src/data/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteData.url}/sitemap.xml`,
  };
}
