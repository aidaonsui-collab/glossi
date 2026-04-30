import sharp from 'sharp';
import fs from 'node:fs';

const svg = fs.readFileSync(new URL('../public/icon.svg', import.meta.url));

const variants = [
  { size: 180, file: 'apple-touch-icon.png' },
  { size: 192, file: 'icon-192.png' },
  { size: 512, file: 'icon-512.png' },
  { size: 32, file: 'favicon-32.png' },
];

for (const v of variants) {
  await sharp(Buffer.from(svg))
    .resize(v.size, v.size)
    .png()
    .toFile(new URL(`../public/${v.file}`, import.meta.url).pathname);
  console.log(`✓ ${v.file} (${v.size}×${v.size})`);
}
