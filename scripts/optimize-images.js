/* eslint-disable @typescript-eslint/no-require-imports */
// One-off: shrink oversized source photos (some were 8000px+ camera originals,
// several 2-11MB) down to sane web dimensions. Next/image still generates
// responsive/format variants at request time, but starting from a realistic
// source size makes every one of those variants far cheaper to produce.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "public", "images");
const MAX_DIMENSION = 2400;
const QUALITY = 82;

async function run() {
  const files = fs.readdirSync(DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
  for (const file of files) {
    const filePath = path.join(DIR, file);
    const before = fs.statSync(filePath).size;
    const image = sharp(filePath);
    const meta = await image.metadata();

    const buffer = await image
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();

    const tmpPath = filePath + ".tmp";
    fs.writeFileSync(tmpPath, buffer);
    fs.rmSync(filePath, { force: true });
    fs.renameSync(tmpPath, filePath);
    const after = buffer.length;
    console.log(
      `${file}: ${meta.width}x${meta.height} ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`
    );
  }
}

run();
