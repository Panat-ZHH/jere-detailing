// Rendert das Link-Vorschaubild (nur im Dev-Modus). `npm run og` speichert es als public/og.jpg.
// Neu erzeugen, wenn sich der Einstiegspreis im Admin ändert.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getServices } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const root = process.cwd();
const font = (w: number) => readFile(path.join(root, `node_modules/@fontsource/outfit/files/outfit-latin-${w}-normal.woff`));
const dataUri = (buf: Buffer, type: string) => `data:${type};base64,${buf.toString("base64")}`;

export async function GET() {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const [f400, f600, f700, services] = await Promise.all([font(400), font(600), font(700), getServices()]);
  const minPrice = services.length ? Math.min(...services.map((s) => s.priceFrom)) : 89;

  const photo = await sharp(path.join(root, "public/images/studio.png"))
    .resize(860, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90 })
    .toBuffer();
  const logo = await sharp(path.join(root, "public/logo.webp")).resize(144, 144).png().toBuffer();

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", position: "relative", background: "#0b0b0d", fontFamily: "Outfit" }}>
        {/* Foto rechts, nach links weich in Schwarz */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUri(photo, "image/jpeg")} width={860} height={630} style={{ position: "absolute", left: 340, top: 0, width: 860, height: 630 }} alt="" />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, #0b0b0d 0%, #0b0b0d 32%, rgba(11,11,13,0.88) 44%, rgba(11,11,13,0.35) 60%, rgba(11,11,13,0) 78%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(0deg, rgba(11,11,13,0.9) 0%, rgba(11,11,13,0) 28%)",
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "56px 64px", width: "100%" }}>
          {/* Marke */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUri(logo, "image/png")} width={72} height={72} style={{ borderRadius: 999, border: "2px solid rgba(255,255,255,0.15)" }} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#ececee", letterSpacing: -0.5 }}>
                jj<span style={{ color: "#e0353b" }}>.</span>detailing01
              </div>
              <div style={{ fontSize: 18, color: "#8b8b94", letterSpacing: 2, textTransform: "uppercase" }}>Professional Auto Care</div>
            </div>
          </div>

          {/* Botschaft */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: 46 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#e0353b", letterSpacing: 3, textTransform: "uppercase" }}>
              Frauenfeld, Thurgau
            </div>
            <div style={{ fontSize: 82, fontWeight: 700, color: "#f4f4f5", lineHeight: 1.0, letterSpacing: -2.5, marginTop: 12 }}>
              Autoaufbereitung
            </div>
            <div style={{ fontSize: 82, fontWeight: 700, color: "#a1a1aa", lineHeight: 1.0, letterSpacing: -2.5, marginTop: 4 }}>
              in Frauenfeld.
            </div>
            <div style={{ fontSize: 26, fontWeight: 400, color: "#c4c4cc", marginTop: 24, maxWidth: 520, lineHeight: 1.35 }}>
              Handwäsche, Politur und Keramik. Von Hand gemacht, von Jeremia.
            </div>
          </div>

          {/* Aufruf */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#e0353b",
                color: "white",
                fontSize: 24,
                fontWeight: 600,
                padding: "16px 30px",
                borderRadius: 999,
              }}
            >
              Termin online anfragen
              <span style={{ fontSize: 26 }}>→</span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 600,
                color: "#ececee",
                padding: "16px 26px",
                borderRadius: 999,
                border: "1.5px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              Pakete ab CHF {minPrice}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Outfit", data: f400, weight: 400, style: "normal" },
        { name: "Outfit", data: f600, weight: 600, style: "normal" },
        { name: "Outfit", data: f700, weight: 700, style: "normal" },
      ],
    },
  );
}
