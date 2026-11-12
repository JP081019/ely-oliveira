/* ImageResponse uses Satori's native img element, rather than next/image. */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Ely Oliveira — Terapeuta Emocional. Atendimento online.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "Logo Ely Oliveira", "Ely_02_Logo_Horizontal.png"));
  return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#F8F5F0", display: "flex", padding: "70px 80px", flexDirection: "column", justifyContent: "space-between" }}><img src={`data:image/png;base64,${logo.toString("base64")}`} width={405} height={120} alt="Ely Oliveira" /><div style={{ display: "flex", flexDirection: "column", color: "#171717" }}><div style={{ fontSize: 70, fontFamily: "serif", lineHeight: 1.1, maxWidth: 950 }}>Acolhimento e respeito à sua história.</div><div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 35, fontSize: 24 }}><span style={{ display: "flex", width: 48, height: 2, background: "#C6A15B" }} />Terapeuta Emocional · Atendimento 100% online</div></div><div style={{ display: "flex", width: "100%", height: 2, background: "#D8C9AE" }} /></div>, size);
}
