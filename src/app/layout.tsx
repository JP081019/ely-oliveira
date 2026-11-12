import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/montserrat";
import "./globals.css";
import { siteConfig, isReview } from "@/lib/site-config";
import { CookiePreferences } from "@/components/site/CookiePreferences";
import { AnalyticsGate } from "@/components/site/AnalyticsGate";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: "%s | Ely Oliveira" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: { icon: [{ url: siteConfig.assets.symbol, type: "image/svg+xml" }], apple: [{ url: "/Logo%20Ely%20Oliveira/Ely_03_Simbolo_Isolado.png" }] },
  openGraph: { locale: "pt_BR", type: "website", siteName: siteConfig.name, title: siteConfig.title, description: siteConfig.description, url: siteConfig.url },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
  robots: isReview ? { index: false, follow: false } : { index: true, follow: true },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F8F5F0" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a>{children}<CookiePreferences /><AnalyticsGate /></body></html>;
}
