import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.terapiaely.com.br/" },
    { url: "https://www.terapiaely.com.br/privacidade" },
  ];
}
