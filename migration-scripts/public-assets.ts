/**
 * Copies every file under `public/assets/` of `tiptap-docs-main` to `public/docs/assets/`, with the
 * same paths. The app serves them at the old URLs `/docs/assets/…`. Deletes `public/docs/assets/`
 * first.
 *
 * Stops with an error that names the file when its type is not `png`, `jpg`, `svg` or `json`.
 *
 * Importing the file runs nothing. `publicAssetPaths` lists the files the step copies.
 */
import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = dirname(import.meta.dirname);
const sourceDir = join(import.meta.dirname, '.sources/tiptap-docs-main/public/assets');
const outputDir = join(appDir, 'public/docs/assets');
const fileTypes = new Set(['png', 'jpg', 'svg', 'json']);

const walkFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walkFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );

/**
 * Returns the URL path of each file the step copies, as the old app served it, sorted. For example
 * `/assets/images/tiptap-logo.png`. Stops on a file type it does not allow.
 */
export const publicAssetPaths = () =>
  walkFiles(sourceDir)
    .map((file) => {
      const path = `/assets/${relative(sourceDir, file).split('\\').join('/')}`;
      const type = /\.([^./]+)$/.exec(path)?.[1] ?? '';
      if (!fileTypes.has(type)) {
        throw new Error(`latest public${path}: file type "${type}" is not allowed`);
      }
      return path;
    })
    .sort();

const main = () => {
  const paths = publicAssetPaths();
  rmSync(outputDir, { recursive: true, force: true });
  for (const path of paths) {
    const outputFile = join(outputDir, path.slice('/assets/'.length));
    mkdirSync(dirname(outputFile), { recursive: true });
    copyFileSync(join(sourceDir, path.slice('/assets/'.length)), outputFile);
    console.log(`public assets: public${path} → ${relative(appDir, outputFile)}`);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
