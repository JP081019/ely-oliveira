import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
const names = ["house-door", "person-heart", "diagram-3", "chat-heart", "mortarboard", "patch-question", "whatsapp", "arrow-right", "arrow-up-right", "arrow-down", "plus-lg", "dash-lg", "list", "x-lg", "camera-video", "instagram", "facebook", "shield-lock", "gear", "check2-circle", "heart", "people"];

export async function GET() {
  const icons = await Promise.all(names.map(async name => {
    const svg = await readFile(join(process.cwd(), "node_modules", "bootstrap-icons", "icons", `${name}.svg`), "utf8");
    return `<symbol id="${name}" viewBox="0 0 16 16">${svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>[\s\S]*$/, "")}</symbol>`;
  }));
  return new Response(`<svg xmlns="http://www.w3.org/2000/svg">${icons.join("")}</svg>`, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
}
