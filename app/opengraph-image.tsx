import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/lib/data";

export const alt = `${profile.name}, ${profile.role}: a split-flap board listing seven systems in service`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Row({ text, cell, gap, font, color = "#ecebe3" }: { text: string; cell: number; gap: number; font: number; color?: string }) {
  return (
    <div style={{ display: "flex", gap }}>
      {Array.from(text).map((ch, i) => (
        <div
          key={i}
          style={{
            width: cell,
            height: cell * 1.42,
            borderRadius: cell * 0.1,
            background: "linear-gradient(180deg, #1c1d1e 0%, #1c1d1e 49.5%, #050505 49.5%, #050505 51%, #161718 51%, #161718 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            fontSize: font,
            fontWeight: 700,
          }}
        >
          {ch === " " ? "" : ch}
        </div>
      ))}
    </div>
  );
}

export default async function OpengraphImage() {
  const archivo = await readFile(join(process.cwd(), "assets/fonts/Archivo-Condensed-Bold.ttf"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#d6dbd4", padding: 48, fontFamily: "Archivo" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#232624",
            borderRadius: 18,
            padding: 22,
            boxShadow: "0 18px 40px -18px rgba(20,24,22,0.55)",
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22, background: "#0e0f0f", borderRadius: 10, padding: "36px 44px" }}>
            <div style={{ display: "flex", gap: 26 }}>
              <Row text="JULLIEN" cell={62} gap={7} font={60} />
              <Row text="NAZREEN" cell={62} gap={7} font={60} />
            </div>
            <Row text="FULL-STACK DEVELOPER" cell={34} gap={5} font={32} />
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
              <div style={{ width: 16, height: 16, borderRadius: 16, background: "#fba537", boxShadow: "0 0 14px rgba(251,165,55,0.7)" }} />
              <Row text="7 SYSTEMS" cell={30} gap={4} font={28} />
              <Row text="LIVE" cell={30} gap={4} font={28} color="#fba537" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#c4c9c2", fontSize: 22, padding: "16px 8px 2px" }}>
            <span>Mobile, web and data systems for used-cooking-oil logistics</span>
            <span>jullienazreen.com</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: archivo, style: "normal", weight: 700 }] },
  );
}
