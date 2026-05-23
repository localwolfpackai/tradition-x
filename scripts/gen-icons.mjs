// Rasterizes public/crest.svg into the PWA icon set.
// Run with: npm run icons

import { readFile, copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = resolve(ROOT, "public");
const APP = resolve(ROOT, "app");

// DESIGN: emerald-deep matches the crest's outer radial stop (#072a1e)
// so the maskable bleed reads as one continuous surface, not a frame.
const EMERALD_DEEP = { r: 0x07, g: 0x2a, b: 0x1e };

const CREST_PATH = resolve(PUBLIC, "crest.svg");

async function loadSvg() {
  return await readFile(CREST_PATH);
}

/**
 * Renders the crest into a square canvas.
 * @param {Buffer} svg
 * @param {number} size  output edge in px
 * @param {number} padPct  fraction of `size` reserved per side as safe-zone padding
 * @param {{r:number,g:number,b:number}|null} bg  background color, or null for transparent
 * @param {string} outPath
 */
async function render(svg, size, padPct, bg, outPath) {
  const inner = Math.round(size * (1 - padPct * 2));
  const rendered = await sharp(svg, { density: 512 })
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg ? { ...bg, alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  await canvas
    .composite([{ input: rendered, gravity: "center" }])
    .png()
    .toFile(outPath);
}

async function main() {
  if (!existsSync(CREST_PATH)) {
    throw new Error(`Missing source SVG at ${CREST_PATH}`);
  }
  const svg = await loadSvg();

  // NOTE: tiny pad on the "flush" icons because the disc fills the viewBox
  // edge-to-edge; without it, aliasing eats the gold border on small sizes.
  const FLUSH_PAD = 0.01;

  const outputs = [
    { path: resolve(PUBLIC, "icon-192.png"),          size: 192, pad: FLUSH_PAD, bg: null },
    { path: resolve(PUBLIC, "icon-512.png"),          size: 512, pad: FLUSH_PAD, bg: null },
    { path: resolve(PUBLIC, "icon-512-maskable.png"), size: 512, pad: 0.12,      bg: EMERALD_DEEP },
    { path: resolve(PUBLIC, "apple-touch-icon.png"),  size: 180, pad: 0.06,      bg: EMERALD_DEEP },
    { path: resolve(PUBLIC, "favicon.png"),           size: 64,  pad: FLUSH_PAD, bg: null },
  ];

  for (const o of outputs) {
    await render(svg, o.size, o.pad, o.bg, o.path);
    process.stdout.write(`wrote ${o.path}\n`);
  }

  // HACK: sharp does not emit .ico. Reuse the 64px PNG as favicon.ico —
  // browsers happily accept PNG-bytes-in-an-ico-name. Real .ico packing
  // would need a separate library; not worth the dep for one icon.
  await copyFile(resolve(PUBLIC, "favicon.png"), resolve(PUBLIC, "favicon.ico"));
  process.stdout.write(`wrote ${resolve(PUBLIC, "favicon.ico")}\n`);

  // Next 16 file-convention: app/icon.png is auto-served at /icon
  if (!existsSync(APP)) {
    await mkdir(APP, { recursive: true });
  }
  await copyFile(resolve(PUBLIC, "favicon.png"), resolve(APP, "icon.png"));
  process.stdout.write(`wrote ${resolve(APP, "icon.png")}\n`);

  // app/apple-icon.png so Next 16 emits the apple-touch-icon link tag too
  await copyFile(resolve(PUBLIC, "apple-touch-icon.png"), resolve(APP, "apple-icon.png"));
  process.stdout.write(`wrote ${resolve(APP, "apple-icon.png")}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
