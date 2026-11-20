/**
 * Copies the favicon `public/favicon.png` of `tiptap-docs-main` to `src/app/docs/icon.png`. Next.js
 * serves that file as the site icon and adds the `<link rel="icon">` tag.
 *
 * Stops with an error when the file is missing or is not a PNG.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const appDir = dirname(import.meta.dirname);
const sourceFile = join(import.meta.dirname, '.sources/tiptap-docs-main/public/favicon.png');
const outputFile = join(appDir, 'src/app/docs/icon.png');
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

if (!existsSync(sourceFile)) {
  throw new Error(`latest public/favicon.png: file not found at ${sourceFile}`);
}
const data = readFileSync(sourceFile);
if (!data.subarray(0, pngSignature.length).equals(pngSignature)) {
  throw new Error('latest public/favicon.png: not a PNG file');
}
writeFileSync(outputFile, data);
console.log(`favicon: public/favicon.png → ${relative(appDir, outputFile)}`);
