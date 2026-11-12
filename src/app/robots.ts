import type { MetadataRoute } from "next";
import { isReview, siteConfig } from "@/lib/site-config";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", ...(isReview ? { disallow: "/" } : { allow: "/", disallow: ["/api/", "/.private/"] }) }, ...(isReview ? {} : { sitemap: `${siteConfig.url}/sitemap.xml` }) };
}
