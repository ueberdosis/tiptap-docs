/**
 * Checks the search ranking against a running docs server.
 *
 *   pnpm test:search <base URL> [--out <report.json>]
 *
 * Calls `/docs/api/search?query=…&tag=…` like the search dialog and checks the page order.
 * Set A is `ranking-tests.json` (latest only). Set B are area names and topic queries of both
 * versions. Exits with 1 when a counted test fails. See `README.md`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Navigation } from '../../src/lib/navigation.tsx';
import { getSearchAreas, type SearchArea } from '../../src/lib/search/areas.ts';

type Version = 'latest' | 'v2';
type Item = { type: string; url: string };
type Result = {
  set: 'A' | 'B';
  version: Version;
  query: string;
  check: string;
  counted: boolean;
  pass: boolean;
  rank: number | null;
  expected: string[];
  top: string[];
};

const routes: Record<Version, string> = { latest: '/docs', v2: '/docs/v2' };
const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const out = outIndex === -1 ? undefined : args[outIndex + 1];
const base = args.find((arg, index) => !arg.startsWith('--') && index !== outIndex + 1);
if (!base) throw new Error('Usage: pnpm test:search <base URL> [--out <report.json>]');

const dir = import.meta.dirname;
const navigation = (version: Version): Navigation =>
  JSON.parse(readFileSync(join(dir, `../../src/lib/navigation/${version}.json`), 'utf8'));
const areas: Record<Version, Map<string, SearchArea>> = {
  latest: getSearchAreas(navigation('latest'), routes.latest),
  v2: getSearchAreas(navigation('v2'), routes.v2),
};

async function search(query: string, version: Version): Promise<Item[]> {
  const params = new URLSearchParams({ query, tag: version });
  const response = await fetch(`${base}/docs/api/search?${params}`);
  if (!response.ok) throw new Error(`Search "${query}" (${version}): HTTP ${response.status}`);
  return (await response.json()) as Item[];
}

const pagesOf = (items: Item[]) => items.filter((item) => item.type === 'page').map((i) => i.url);
const rankOf = (pages: string[], expected: string[]) =>
  pages.findIndex((page) => expected.includes(page)) + 1 || null;

const missing = new Set<string>();
const checkedPages = new Map<string, boolean>();
async function exists(url: string) {
  if (!checkedPages.has(url)) {
    const response = await fetch(`${base}${url}`, { redirect: 'manual' });
    checkedPages.set(url, response.status === 200);
  }
  if (!checkedPages.get(url)) missing.add(url);
  return checkedPages.get(url);
}

const results: Result[] = [];
const scopeErrors: string[] = [];
function checkScope(version: Version, query: string, items: Item[]) {
  for (const { url } of items) {
    const path = url.split('#')[0];
    const inV2 = path === routes.v2 || path.startsWith(`${routes.v2}/`);
    if (inV2 !== (version === 'v2')) scopeErrors.push(`${version} "${query}": ${url}`);
  }
}

// Set A
const setA = JSON.parse(readFileSync(join(dir, 'ranking-tests.json'), 'utf8')) as {
  within: number;
  tests: { query: string; expect: string[]; why: string }[];
};
for (const test of setA.tests) {
  const expected = test.expect.map((path) => `${routes.latest}${path}`);
  for (const url of expected) await exists(url);
  const items = await search(test.query, 'latest');
  checkScope('latest', test.query, items);
  const pages = pagesOf(items);
  const rank = rankOf(pages, expected);
  const synonym = test.why.includes('(synonym)');
  results.push({
    set: 'A',
    version: 'latest',
    query: test.query,
    check: synonym ? `top ${setA.within}, synonym` : `top ${setA.within}`,
    counted: !synonym,
    pass: rank !== null && rank <= setA.within,
    rank,
    expected,
    top: pages.slice(0, setA.within),
  });
}

// Set B
async function caseB(
  version: Version,
  query: string,
  expected: string[],
  within: number,
  check = `top ${within}`,
  pass?: (pages: string[], items: Item[]) => boolean,
) {
  for (const url of expected) await exists(url);
  const items = await search(query, version);
  checkScope(version, query, items);
  const pages = pagesOf(items);
  const rank = rankOf(pages, expected);
  results.push({
    set: 'B',
    version,
    query,
    check,
    counted: true,
    pass: pass ? pass(pages, items) : rank !== null && rank <= within,
    rank,
    expected,
    top: pages.slice(0, 5),
  });
}

for (const version of ['latest', 'v2'] as const) {
  const root = routes[version];
  for (const area of areas[version].values())
    await caseB(version, area.name, [area.overview], 1, 'area overview first');

  const collaboration = areas[version].get('collaboration');
  if (collaboration)
    await caseB(
      version,
      'collaboration',
      [collaboration.overview],
      1,
      'Collaboration pages before other pages',
      (pages) => {
        const firstOther = pages.findIndex((page) => !collaboration.pages.has(page));
        return (
          pages[0] === collaboration.overview &&
          (firstOther === -1 ||
            pages.slice(firstOther).every((page) => !collaboration.pages.has(page)))
        );
      },
    );

  await caseB(version, 'collaboration authentication', [`${root}/guides/authentication`], 10);
  for (const query of ['snapshot', 'snapshots']) {
    if (version === 'latest')
      await caseB(version, query, [`${root}/collaboration/documents/snapshot`], 10);
    else {
      const alternatives = [
        `${root}/editor/extensions/functionality/snapshot-compare`,
        `${root}/collaboration/documents/snapshot-compare`,
      ];
      await caseB(
        version,
        query,
        [`${root}/collaboration/documents/history`, ...alternatives],
        10,
        'history in top 10 or a snapshot-compare page in top 3',
        (pages) => {
          const history = rankOf(pages, [`${root}/collaboration/documents/history`]);
          const alternative = rankOf(pages, alternatives);
          return (history !== null && history <= 10) || (alternative !== null && alternative <= 3);
        },
      );
    }
  }
  if (version === 'latest') {
    await caseB(
      version,
      'content protection',
      [`${root}/composable-docs/content-protection/getting-started/overview`],
      10,
    );
    await caseB(version, 'slots', [`${root}/composable-docs/slots/getting-started/overview`], 10);
  }
  await caseB(version, 'setContent', [`${root}/editor/api/commands/content/set-content`], 3);
  await caseB(version, 'clearContent', [`${root}/editor/api/commands/content/clear-content`], 3);
  await caseB(version, 'CodeBlock', [`${root}/editor/extensions/nodes/code-block`], 3);
  for (const query of ['', 'zzqxnonexistentword'])
    await caseB(version, query, [], 0, 'no results', (_pages, items) => items.length === 0);
}

// Report
for (const result of results) {
  const mark = result.pass ? '✓' : result.counted ? '✗' : '·';
  const label = `${result.set} ${result.version.padEnd(6)} ${JSON.stringify(result.query)}`;
  console.log(
    `${mark} ${label.padEnd(48)} ${result.rank ? `#${result.rank}` : '–'}  ${result.check}`,
  );
  if (!result.pass) {
    console.log(`    expected ${result.expected.join(' or ') || 'nothing'}`);
    console.log(`    got      ${result.top.join(', ') || 'nothing'}`);
  }
}
const summary = (set: 'A' | 'B', counted: boolean) => {
  const list = results.filter((r) => r.set === set && r.counted === counted);
  return `${list.filter((r) => r.pass).length}/${list.length}`;
};
console.log(
  `\nSet A: ${summary('A', true)} counted, ${summary('A', false)} synonym tests (not counted)`,
);
for (const version of ['latest', 'v2'] as const) {
  const list = results.filter((r) => r.set === 'B' && r.version === version);
  console.log(`Set B ${version}: ${list.filter((r) => r.pass).length}/${list.length}`);
}
console.log(`Version scope: ${scopeErrors.length ? scopeErrors.join('\n  ') : 'ok'}`);
console.log(`Missing expected pages: ${[...missing].join(', ') || 'none'}`);

if (out)
  writeFileSync(
    out,
    `${JSON.stringify({ base, results, scopeErrors, missing: [...missing] }, null, 2)}\n`,
  );
if (results.some((r) => r.counted && !r.pass) || scopeErrors.length || missing.size)
  process.exitCode = 1;
