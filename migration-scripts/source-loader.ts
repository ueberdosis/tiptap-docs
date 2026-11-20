/**
 * Runs compiled source modules and prints one named export of each as one JSON object, keyed by
 * entry. Usage: `node source-loader.ts <clone dir> <compiled dir> <export> <calls> <entry>...`, where
 * each entry is a `.js` file relative to the compiled dir, for example `src/content/sidebar.js`.
 * `<calls>` is `null` to print the export itself, or a JSON list of argument lists: the export is
 * then a function, called once per argument list, and the list of results is printed.
 * Stops with an error when a module does not have the export, or `<calls>` is set and the export
 * is not a function. A `null` export stays `null`.
 *
 * Module hooks:
 * - `@/…` resolves to `<compiled>/src/…`, like the clone's `tsconfig.json` paths.
 * - Imports without an extension resolve to `.js` or `/index.js`.
 * - `front-matter` resolves to `sidebar-front-matter.ts`.
 * The working directory is the clone, because the source reads its pages relative to it.
 */
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const [cloneArg, compiledArg, exportName, callsArg, ...entries] = process.argv.slice(2);
const calls: unknown[][] | null = JSON.parse(callsArg);
const clone = resolve(cloneArg);
const compiled = resolve(compiledArg);
const frontMatterUrl = pathToFileURL(join(import.meta.dirname, 'sidebar-front-matter.ts')).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'front-matter') return { url: frontMatterUrl, shortCircuit: true };
    let base: string | undefined;
    if (specifier.startsWith('@/')) base = join(compiled, 'src', specifier.slice(2));
    else if (/^\.\.?\//.test(specifier) && context.parentURL?.startsWith('file:')) {
      base = join(fileURLToPath(new URL('.', context.parentURL)), specifier);
    }
    if (base?.startsWith(compiled)) {
      const file = [`${base}.js`, join(base, 'index.js'), base].find(
        (candidate) => candidate.endsWith('.js') && existsSync(candidate),
      );
      if (file) return { url: pathToFileURL(file).href, format: 'module', shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

process.chdir(clone);
const result: Record<string, unknown> = {};
for (const entry of entries) {
  const module = await import(pathToFileURL(join(compiled, entry)).href);
  if (!(exportName in module) || module[exportName] === undefined) {
    throw new Error(`${entry} exports no ${exportName}`);
  }
  const value = module[exportName];
  if (calls && typeof value !== 'function')
    throw new Error(`${entry}: ${exportName} is not a function`);
  result[entry] = calls ? calls.map((args) => value(...args)) : value;
}
process.stdout.write(JSON.stringify(result));
