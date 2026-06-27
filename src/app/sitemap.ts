import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jobroute.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/jobs",
    "/matching",
    "/cover-letter",
    "/interview",
    "/resume",
    "/login",
    "/register",
    "/terms",
    "/privacy",
  ];
  const now = new Date();
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/jobs" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
