import type { MetadataRoute } from "next";
import projectsData from "@/src/data/projects";
import certificatesData from "@/src/data/certificates";
import siteData from "@/src/data/site";
import type { Certificate, Project } from "@/types";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/skills",
    "/certificates",
    "/resume",
    "/contact",
  ].map((path) => ({
    url: `${siteData.url}${path}`,
  }));

  const projectRoutes = (projectsData as Project[]).map((p) => ({
    url: `${siteData.url}/projects/${p.slug}`,
  }));

  const certificateRoutes = (certificatesData as Certificate[]).map((c) => ({
    url: `${siteData.url}/certificates/${c.id}`,
  }));

  return [...staticRoutes, ...projectRoutes, ...certificateRoutes];
}
