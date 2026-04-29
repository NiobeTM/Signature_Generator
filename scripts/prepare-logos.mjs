import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const inputs = [
  { in: "elkak-logo-top.png", out: "elkak-logo-top.white.png" },
  { in: "elkak-logo-bottom-en.png", out: "elkak-logo-bottom-en.white.png" },
  { in: "elkak-logo-bottom-el.png", out: "elkak-logo-bottom-el.white.png" },
];

await mkdir(PUBLIC_DIR, { recursive: true });

for (const { in: inName, out: outName } of inputs) {
  const inputPath = path.join(PUBLIC_DIR, inName);
  const outputPath = path.join(PUBLIC_DIR, outName);

  const image = sharp(inputPath);
  const meta = await image.metadata();

  // If the input already has transparency, "flatten" will still ensure
  // the rendered background is white in all contexts (e.g., email clients).
  await image
    .flatten({ background: "#ffffff" })
    .png({
      compressionLevel: 9,
      palette: false,
    })
    .toFile(outputPath);

  // eslint-disable-next-line no-console
  console.log(
    `Prepared ${outName} (${meta.width ?? "?"}x${meta.height ?? "?"})`,
  );
}

