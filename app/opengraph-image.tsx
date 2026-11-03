import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Ely Oliveira — Terapeuta TRG. Atendimento online em todo o Brasil.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/images/img1.jpeg"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#241714", color: "#f7f3e8", padding: "45px 60px", alignItems: "center", gap: 55 }}>
      <div style={{ display: "flex", flexDirection: "column", width: 640, flexShrink: 0 }}>
        <div style={{ color: "#C9B849", fontSize: 23, letterSpacing: 3 }}>TERAPIA EMOCIONAL · TRG</div>
        <div style={{ fontSize: 76, lineHeight: 1.1, marginTop: 36 }}>Ely Oliveira</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 31, lineHeight: 1.4, marginTop: 22 }}><span>Um espaço de escuta.</span><span>Um tempo para você.</span></div>
        <div style={{ color: "#C9B849", fontSize: 23, marginTop: 40 }}>Atendimento online em todo o Brasil</div>
        <div style={{ fontSize: 19, marginTop: 18 }}>www.terapiaely.com.br</div>
      </div>
      {/* Original photograph, fitted in full without recreating the face or brand. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64,${photo.toString("base64")}`} width={330} height={495} alt="Ely Oliveira" style={{ objectFit: "contain", flexShrink: 0 }} />
    </div>, size,
  );
}
