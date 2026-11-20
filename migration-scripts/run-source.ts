/**
 * Runs TypeScript files of a clone as they are and returns one named export of each.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const appDir = dirname(import.meta.dirname);
const sourcesDir = join(import.meta.dirname, '.sources');

/**
 * Compiles `files` (relative to `clone`) and what they import with the installed `tsc` (`noCheck`)
 * into `.sources/<name>/`, runs the result with `source-loader.ts`, and returns the export
 * `exportName` of each file as JSON data, keyed by file. With `calls`, the export must be a
 * function: it is called once per argument list, and the value is the list of results. Throws when
 * a file lacks the export.
 */
export const runSourceExport = (
  name: string,
  clone: string,
  files: string[],
  exportName: string,
  calls?: unknown[][],
): Record<string, unknown> => {
  const outDir = join(sourcesDir, name);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const tsconfig = join(outDir, 'tsconfig.json');
  writeFileSync(
    tsconfig,
    JSON.stringify({
      compilerOptions: {
        target: 'es2022',
        module: 'esnext',
        moduleResolution: 'bundler',
        paths: { '@/*': [join(clone, 'src/*')] },
        rootDir: clone,
        outDir: join(outDir, 'out'),
        noCheck: true,
        skipLibCheck: true,
        types: [],
      },
      files: files.map((file) => join(clone, file)),
    }),
  );
  execFileSync(join(appDir, 'node_modules/.bin/tsc'), ['-p', tsconfig], { stdio: 'inherit' });
  const entries = files.map((file) => file.replace(/\.tsx?$/, '.js'));
  const output = execFileSync(
    process.execPath,
    [
      '--disable-warning=ExperimentalWarning',
      join(import.meta.dirname, 'source-loader.ts'),
      clone,
      join(outDir, 'out'),
      exportName,
      JSON.stringify(calls ?? null),
      ...entries,
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );
  const values: Record<string, unknown> = JSON.parse(output);
  return Object.fromEntries(files.map((file, i) => [file, values[entries[i]]]));
};
