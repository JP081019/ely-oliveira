import type { Metadata } from "next";
import { Figtree, Instrument_Serif, Dancing_Script } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { octoberRoseCampaign } from "@/lib/campaigns";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const instrument = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-display", display: "swap" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-hand", display: "swap" });
const title = "Ely Oliveira | Terapeuta Emocional TRG · Atendimento online";
const description = "Um espaço de escuta e acolhimento para sua saúde emocional. Conheça Ely Oliveira, terapeuta emocional TRG, com atendimento 100% online em todo o Brasil.";

export const metadata: Metadata = {
  title, description,
  icons: {
    icon: { url: "/images/Logo%20-%20Ely%20Transparente.jpeg", type: "image/jpeg" },
  },
  openGraph: { title, description, locale: "pt_BR", type: "website", siteName: "Ely Oliveira" },
  twitter: { card: "summary", title, description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${figtree.variable} ${instrument.variable} ${dancing.variable}${octoberRoseCampaign.enabled ? " october-rose-active" : ""}`}>{children}</body></html>;
}
