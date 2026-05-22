/**
 * Build tab favicon assets from the ELKAK logo PNG.
 * Usage: node scripts/generate-favicons.mjs [path-to-source-png]
 *
 * Output uses a transparent canvas so the browser tab chrome shows through
 * (favicons do not inherit your app's page background).
 */
import sharp from "sharp";
import { writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const defaultSource = path.join(ROOT, "assets", "elkak-favicon-source.png");

const source = process.argv[2]
  ? path.resolve(process.argv[2])
  : defaultSource;

/** Transparent letterboxing when fitting into a square. */
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

await mkdir(PUBLIC, { recursive: true });

if (source !== defaultSource) {
  await mkdir(path.dirname(defaultSource), { recursive: true });
  await copyFile(source, defaultSource);
}

/**
 * Ensure RGBA with transparency.
 * - True PNG with alpha: keep as-is.
 * - JPEG / opaque PNG (e.g. white logo on black): derive alpha from brightness
 *   so black becomes transparent (common when exports flatten transparency).
 */
async function logoWithAlpha(input) {
  const meta = await sharp(input).metadata();
  if (meta.hasAlpha) {
    return sharp(input).ensureAlpha().png().toBuffer();
  }

  // White mark on dark background → use luminance as alpha channel.
  const alpha = await sharp(input).greyscale().normalise().toBuffer();
  return sharp(input)
    .ensureAlpha()
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

const withAlpha = await logoWithAlpha(source);

// Trim empty/transparent margins so the mark fills the favicon square.
const trimmedLogo = await sharp(withAlpha)
  .trim({ threshold: 10 })
  .png()
  .toBuffer();

async function squarePng(size) {
  return sharp(trimmedLogo)
    .resize(size, size, {
      fit: "contain",
      background: TRANSPARENT,
      position: "center",
    })
    .png()
    .toBuffer();
}

const png32 = await squarePng(32);
const png180 = await squarePng(180);

await writeFile(path.join(PUBLIC, "elkak-tab-icon-v2.png"), png32);
await writeFile(path.join(PUBLIC, "apple-icon.png"), png180);

/** ICO container with embedded PNG (Windows Vista+). */
function pngToIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + 16 * count;
  for (const { buf, dim } of images) {
    const entry = Buffer.alloc(16);
    entry[0] = dim >= 256 ? 0 : dim;
    entry[1] = dim >= 256 ? 0 : dim;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += buf.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.buf)]);
}

const png16 = await squarePng(16);
const png48 = await squarePng(48);
const ico = pngToIco([
  { buf: png16, dim: 16 },
  { buf: png32, dim: 32 },
  { buf: png48, dim: 48 },
]);
await writeFile(path.join(PUBLIC, "favicon.ico"), ico);

console.log("Wrote transparent favicon.ico, elkak-tab-icon-v2.png, apple-icon.png");
