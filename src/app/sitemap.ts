import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/github";
import { siteUrl } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects, status } = await getCatalog();
  // A temporary failure must not publish a sitemap that drops existing projects.
  if (status === "unavailable")
    throw new Error("Catalog unavailable for sitemap");
  return [
    { url: siteUrl },
    ...projects.map((project) => ({
      url: `${siteUrl}/projetos/${encodeURIComponent(project.slug)}`,
    })),
  ];
}
