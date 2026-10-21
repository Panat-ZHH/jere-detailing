// Speichert das Link-Vorschaubild als public/og.jpg (1200x630, leichtes JPEG für WhatsApp & Co.).
// Voraussetzung: Dev-Server läuft (npm run dev). Port per OG_PORT, Standard 3031.
import sharp from "sharp";

const port = process.env.OG_PORT ?? "3031";
const res = await fetch(`http://localhost:${port}/og-render`);
if (!res.ok) {
  console.error(`Fehler ${res.status}: Läuft der Dev-Server auf Port ${port}?`);
  process.exit(1);
}
const png = Buffer.from(await res.arrayBuffer());
const info = await sharp(png).jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile("public/og.jpg");
console.log(`public/og.jpg gespeichert (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
