/**
 * Writes the plan and status that each latest page inherits from the sidebar to
 * `src/lib/inherited-labels.json`: page route (for example `/ai/deprecated/agent/overview`) →
 * `{ plan?, status? }`, with the upstream names (for example `Paid`, `Deprecated`). Pages without
 * inherited labels are left out. The home page is left out, because its upstream header has none.
 *
 * Runs `inheritedLabels(route)` of `src/server/inheritedLabels.ts` of `tiptap-docs-main` as it is,
 * with `run-source.ts`, once per page in `src/content/` (without `_shared/` folders).
 *
 * Stops with an error that names the page on a field other than `plan` and `status`, or a plan or
 * status that `inheritedPlanTags` and `inheritedStatusTags` in `src/lib/page-tag-labels.ts` do not
 * know.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { inheritedPlanTags, inheritedStatusTags } from '../src/lib/page-tag-labels.ts';
import { runSourceExport } from './run-source.ts';

const appDir = dirname(import.meta.dirname);
const clone = join(import.meta.dirname, '.sources/tiptap-docs-main');
const contentDir = join(clone, 'src/content');
const outputFile = join(appDir, 'src/lib/inherited-labels.json');
const sourceFile = 'src/server/inheritedLabels.ts';

const routes = (readdirSync(contentDir, { recursive: true }) as string[])
  .filter((file) => file.endsWith('.mdx') && !file.split('/').includes('_shared'))
  .map((file) => `/${file.replace(/\.mdx$/, '').replace(/(^|\/)index$/, '')}`)
  .filter((route) => route !== '/')
  .sort();

const results = runSourceExport(
  'inherited-labels',
  clone,
  [sourceFile],
  'inheritedLabels',
  routes.map((route) => [route]),
)[sourceFile] as Record<string, unknown>[];

const data: Record<string, { plan?: string; status?: string }> = {};
routes.forEach((route, i) => {
  const { plan, status, ...rest } = results[i];
  const extra = Object.keys(rest).filter((key) => rest[key] !== undefined);
  if (extra.length > 0) throw new Error(`${route}: unknown inherited label field "${extra[0]}"`);
  if (plan !== undefined && !(typeof plan === 'string' && plan in inheritedPlanTags)) {
    throw new Error(`${route}: unknown inherited plan ${JSON.stringify(plan)}`);
  }
  if (status !== undefined && !(typeof status === 'string' && status in inheritedStatusTags)) {
    throw new Error(`${route}: unknown inherited status ${JSON.stringify(status)}`);
  }
  if (plan === undefined && status === undefined) return;
  data[route] = {
    ...(plan !== undefined && { plan: plan as string }),
    ...(status !== undefined && { status: status as string }),
  };
});

writeFileSync(outputFile, `${JSON.stringify(data, null, 2)}\n`);
execFileSync(join(appDir, 'node_modules/.bin/biome'), ['format', '--write', outputFile], {
  stdio: 'inherit',
});
console.log(
  `inherited labels: ${Object.keys(data).length} of ${routes.length} latest pages → src/lib/inherited-labels.json`,
);
