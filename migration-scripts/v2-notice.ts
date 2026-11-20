/**
 * Reads the v2 notice bar (`CTA_BAR` in `src/utils/constants.ts` of `tiptap-docs-v2`) and writes
 * `src/lib/v2-notice.json`: `{ text, url }`, or `null` when `CTA_BAR` is `null`. Expects the fresh
 * output of `copy.ts`, because the link must be an imported latest page.
 *
 * Runs the source file as it is (`run-source.ts`). The url must be `https://tiptap.dev/docs` or a
 * page below it. It becomes an app URL with `resolvePageLink` from `links.ts`, for example
 * `https://tiptap.dev/docs/resources/whats-new` → `/docs/resources/whats-new`.
 *
 * Stops with an error on another shape, an unknown field, an empty value, another url or a link
 * that is not an imported latest page.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import type { V2Notice } from '../src/lib/v2-notice.ts';
import { resolvePageLink } from './links.ts';
import { runSourceExport } from './run-source.ts';

const appDir = dirname(import.meta.dirname);
const clone = join(import.meta.dirname, '.sources/tiptap-docs-v2');
const sourceFile = 'src/utils/constants.ts';
const outputFile = join(appDir, 'src/lib/v2-notice.json');
const latestIndex = join(appDir, 'content/docs/index.mdx');
const where = `v2 ${sourceFile} CTA_BAR`;

const fail = (message: string): never => {
  throw new Error(`${where}: ${message}`);
};

const readNotice = (value: unknown): V2Notice => {
  if (value === null) return null;
  if (typeof value !== 'object' || Array.isArray(value)) return fail('is not an object or null');
  const fields = value as Record<string, unknown>;
  for (const field of Object.keys(fields)) {
    if (field !== 'text' && field !== 'url') fail(`has an unknown field "${field}"`);
  }
  for (const field of ['text', 'url']) {
    if (typeof fields[field] !== 'string' || fields[field] === '') {
      fail(`field "${field}" is not a non-empty string`);
    }
  }
  const text = fields.text as string;
  const url = fields.url as string;
  const match = /^https:\/\/tiptap\.dev(\/docs(?:[/?#].*)?)$/.exec(url);
  if (!match) return fail(`url "${url}" is not a https://tiptap.dev/docs link`);
  const target = resolvePageLink('latest', latestIndex, match[1]);
  if (target.kind !== 'ok') return fail(`url "${url}": ${target.reason} in latest`);
  return { text, url: target.text };
};

const { [sourceFile]: value } = runSourceExport('v2-notice', clone, [sourceFile], 'CTA_BAR');
const notice = readNotice(value);
writeFileSync(outputFile, `${JSON.stringify(notice, null, 2)}\n`);
// Format like the rest of the repository, so `pnpm lint` passes on the output.
execFileSync(join(appDir, 'node_modules/.bin/biome'), ['format', '--write', outputFile], {
  stdio: ['ignore', 'ignore', 'inherit'],
});
console.log(
  `v2 notice: ${notice ? `"${notice.text}" → ${notice.url}` : 'none'} → ${relative(appDir, outputFile)}`,
);
