/**
 * Runs the import steps in order: `enterprise-content.ts`, `copy.ts`, `redirects.ts`,
 * `heading-ids.ts`, `links.ts`, `components.ts`, `sidebars.ts`, `v2-notice.ts`,
 * `feature-catalog.ts`, `favicon.ts`, then `public-assets.ts`. Passes `--strict` to the copy.
 * Stops at the first step that fails.
 */
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const strict = process.argv.includes('--strict');

const steps = [
  ['enterprise-content.ts'],
  ['copy.ts', ...(strict ? ['--strict'] : [])],
  ['redirects.ts'],
  ['heading-ids.ts'],
  ['links.ts'],
  ['components.ts'],
  ['sidebars.ts'],
  ['v2-notice.ts'],
  ['feature-catalog.ts'],
  ['favicon.ts'],
  ['public-assets.ts'],
];
for (const [script, ...args] of steps) {
  try {
    execFileSync(process.execPath, [join(import.meta.dirname, script), ...args], {
      stdio: 'inherit',
    });
  } catch {
    process.exit(1);
  }
}
