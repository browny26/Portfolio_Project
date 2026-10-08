import type { MetadataRoute } from "next";
import { siteUrl } from "@/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Search engines and AI crawlers alike: the whole site is public, and
    // being read by answer engines is the point of /llms.txt.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
