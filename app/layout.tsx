import type { Metadata } from "next";
import { Figtree, Instrument_Serif, Dancing_Script } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { SiteAnalytics } from "@/components/site-analytics";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const instrument = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-display", display: "swap" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-hand", display: "swap" });
const title = "Ely Oliveira | Terapeuta TRG — Atendimento Online";
const description = "Conheça o trabalho de Ely Oliveira, terapeuta especializada em TRG. Atendimento online com acolhimento, escuta e atenção à saúde emocional.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.terapiaely.com.br"),
  title, description,
  referrer: "strict-origin-when-cross-origin",
  icons: {
    icon: { url: "/images/Logo%20-%20Ely%20Transparente.jpeg", type: "image/jpeg" },
  },
  openGraph: { title, description, url: "https://www.terapiaely.com.br/", locale: "pt_BR", type: "website", siteName: "Ely Oliveira", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ely Oliveira — Terapeuta TRG. Atendimento online." }] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${figtree.variable} ${instrument.variable} ${dancing.variable}`}>{children}<SiteAnalytics /></body></html>;
}
