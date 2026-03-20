/**
 * PWA Icon Generator
 * Run: node scripts/generate-icons.mjs
 *
 * Generates PNG icons for the PWA from logo-icon.svg.
 * Requires: sharp  (npm install --save-dev sharp)
 *
 * Output:
 *   public/icons/icon-192.png
 *   public/icons/icon-512.png
 *   public/icons/icon-152.png
 *   public/icons/icon-167.png
 *   public/icons/apple-touch-icon.png  (180x180)
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const outputDir = path.join(root, "public", "icons");
fs.mkdirSync(outputDir, { recursive: true });

// Build a self-contained SVG with the branded purple background + logo
const svgSource = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7F13EC"/>
      <stop offset="100%" stop-color="#9D4DFF"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="92" fill="url(#bg)"/>
  <!-- T lettermark centered -->
  <text
    x="256"
    y="340"
    font-family="Georgia, serif"
    font-size="320"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    dominant-baseline="auto"
    letter-spacing="-8"
  >T</text>
</svg>
`;

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-152.png", size: 152 },
  { name: "icon-167.png", size: 167 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  const outPath = path.join(outputDir, name);
  await sharp(Buffer.from(svgSource))
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`✓ Generated ${name} (${size}×${size})`);
}

console.log("\n✅ All PWA icons generated in public/icons/");
