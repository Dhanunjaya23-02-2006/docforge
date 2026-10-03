import { MetadataRoute } from "next";
import { getToolsByCategory } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://docforge.com";
  const currentDate = new Date();

  const staticRoutes = [
    "",
    "/tools",
    "/blog",
    "/pricing",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/faq",
    "/help",
    "/guides",
    "/disclaimer",
    "/dmca",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const toolRoutes = [
    ...getToolsByCategory("pdf"),
    ...getToolsByCategory("images"),
    ...getToolsByCategory("documents"),
    ...getToolsByCategory("ocr"),
    ...getToolsByCategory("generators"),
    ...getToolsByCategory("templates"),
  ]
    .filter((t) => !t.comingSoon)
    .map((tool) => ({
      url: `${baseUrl}${tool.route}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...toolRoutes];
}