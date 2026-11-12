import type { MetadataRoute } from "next";
import { isReview, siteConfig } from "@/lib/site-config";
import { privacyContent } from "@/content/privacy";
export default function sitemap(): MetadataRoute.Sitemap {
  return isReview ? [] : [{ url: siteConfig.url, changeFrequency: "monthly", priority: 1 }, ...(privacyContent.status === "approved" ? [{ url: `${siteConfig.url}/politica-de-privacidade`, changeFrequency: "yearly" as const, priority: .3 }] : [])];
}
