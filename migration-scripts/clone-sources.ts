/**
 * Clones the newest commit of each source repository into `migration-scripts/.sources/`.
 * Deletes the folder first, so every run starts fresh. Prints the commit ID of each clone.
 * Stops with an error if a clone fails.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const sourcesDir = join(import.meta.dirname, '.sources');

const sources = [
  { name: 'tiptap-docs', branch: 'main', folder: 'tiptap-docs-main' },
  { name: 'tiptap-docs', branch: 'v2', folder: 'tiptap-docs-v2' },
  { name: 'tiptap', branch: 'main', folder: 'tiptap-main' },
];

rmSync(sourcesDir, { recursive: true, force: true });
mkdirSync(sourcesDir, { recursive: true });

for (const source of sources) {
  const target = join(sourcesDir, source.folder);
  const url = `https://github.com/ueberdosis/${source.name}.git`;

  execFileSync('git', ['clone', '--depth', '1', '--branch', source.branch, url, target], {
    stdio: 'inherit',
  });

  const commit = execFileSync('git', ['-C', target, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
  }).trim();

  console.log(`${source.name} ${source.branch}: ${commit}`);
}
