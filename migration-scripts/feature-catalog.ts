/**
 * Reads the latest feature catalog and writes `src/lib/feature-catalog.json` (`FeatureCatalogData`
 * in `src/lib/feature-catalog.ts`). Expects the fresh output of `copy.ts`, because every link
 * must be an imported latest page.
 *
 * Runs the source files as they are (`run-source.ts`) in `tiptap-docs-main`:
 * - `getCatalog()` in `src/server/getCatalog.ts`: the entries, in source order.
 * - `CATALOG_GROUPS` in `src/content/catalog.ts`: the groups, in page order.
 * - `PLAN_LABELS` in `src/content/plans.ts`: the plan names on the cards.
 * Entry links become app URLs with `resolvePageLink` from `links.ts`, for example
 * `/editor/extensions/marks/bold` → `/docs/editor/extensions/marks/bold`.
 *
 * Stops with an error on an unknown field, a missing or empty value, an unknown group or plan, a
 * group without entries or a link that is not an imported latest page.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import type { FeatureCatalogData } from '../src/lib/feature-catalog.ts';
import { resolvePageLink } from './links.ts';
import { runSourceExport } from './run-source.ts';

const appDir = dirname(import.meta.dirname);
const clone = join(import.meta.dirname, '.sources/tiptap-docs-main');
const outputFile = join(appDir, 'src/lib/feature-catalog.json');
const latestIndex = join(appDir, 'content/docs/index.mdx');
const catalogFile = 'src/server/getCatalog.ts';
const groupsFile = 'src/content/catalog.ts';
const plansFile = 'src/content/plans.ts';

type Fields = Record<string, unknown>;

/** Checks that `value` is an object with only `allowed` fields, and returns it. */
const readObject = (where: string, value: unknown, allowed: string[]): Fields => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${where}: is not an object`);
  }
  for (const field of Object.keys(value)) {
    if (!allowed.includes(field)) throw new Error(`${where}: has an unknown field "${field}"`);
  }
  return value as Fields;
};

const readText = (where: string, fields: Fields, field: string): string => {
  const value = fields[field];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${where}: field "${field}" is not a non-empty string`);
  }
  return value;
};

const readList = (where: string, value: unknown): unknown[] => {
  if (!Array.isArray(value)) throw new Error(`${where}: is not a list`);
  return value;
};

/** The app URL of the latest page `link`. */
const pageUrl = (where: string, link: string): string => {
  const target = resolvePageLink('latest', latestIndex, link);
  if (target.kind !== 'ok') throw new Error(`${where}: link "${link}": ${target.reason} in latest`);
  return target.text;
};

/** Filter value of a plan, for example `pilot-program` for "Pilot program". */
const planValue = (plan: string) => plan.toLowerCase().replace(/\s+/g, '-');

const rawGroups = readList(
  `${groupsFile} CATALOG_GROUPS`,
  runSourceExport('feature-catalog-groups', clone, [groupsFile], 'CATALOG_GROUPS')[groupsFile],
);
const rawPlanLabels = runSourceExport('feature-catalog-plans', clone, [plansFile], 'PLAN_LABELS')[
  plansFile
];
if (!rawPlanLabels || typeof rawPlanLabels !== 'object' || Array.isArray(rawPlanLabels)) {
  throw new Error(`${plansFile} PLAN_LABELS: is not an object`);
}
/** Card label of each source plan, for example `Team plan` for `Team`. */
const planLabels = new Map(
  Object.entries(rawPlanLabels).map(([plan, value]) => {
    const where = `${plansFile} PLAN_LABELS.${plan}`;
    return [plan, readText(where, readObject(where, value, ['label', 'tooltip']), 'label')];
  }),
);
const [rawEntries] = readList(
  `${catalogFile} getCatalog()`,
  runSourceExport('feature-catalog', clone, [catalogFile], 'getCatalog', [[]])[catalogFile],
);

const groups = rawGroups.map((value, index) => {
  const where = `${groupsFile} CATALOG_GROUPS[${index}]`;
  const group = readObject(where, value, ['id', 'title', 'area']);
  return { id: readText(where, group, 'id'), title: readText(where, group, 'title') };
});
const groupIds = new Set(groups.map(({ id }) => id));

const entries = readList(`${catalogFile} getCatalog()`, rawEntries).map((value, index) => {
  const where = `${catalogFile} getCatalog()[${index}]`;
  const entry = readObject(where, value, [
    'name',
    'description',
    'icon',
    'type',
    'group',
    'area',
    'plan',
    'status',
    'url',
    'package',
    'industries',
  ]);
  const name = readText(where, entry, 'name');
  const at = `${where} "${name}"`;
  const group = readText(at, entry, 'group');
  if (!groupIds.has(group)) throw new Error(`${at}: unknown group "${group}"`);
  const plan = readText(at, entry, 'plan');
  const label = planLabels.get(plan);
  if (!label) throw new Error(`${at}: unknown plan "${plan}"`);
  const status = entry.status === undefined ? undefined : readText(at, entry, 'status');
  return {
    name,
    description: readText(at, entry, 'description'),
    icon: readText(at, entry, 'icon'),
    group,
    plan: planValue(plan),
    tags: [label, ...(status ? [status] : [])],
    url: pageUrl(at, readText(at, entry, 'url')),
  };
});

for (const { id } of groups) {
  if (!entries.some((entry) => entry.group === id)) {
    throw new Error(`${groupsFile}: group "${id}" has no entries`);
  }
}

const usedPlans = new Set(entries.map(({ plan }) => plan));
const data: FeatureCatalogData = {
  plans: [...planLabels]
    .filter(([plan]) => usedPlans.has(planValue(plan)))
    .map(([plan, label]) => ({ value: planValue(plan), label })),
  groups,
  entries,
};
writeFileSync(outputFile, `${JSON.stringify(data, null, 2)}\n`);
// Format like the rest of the repository, so `pnpm lint` passes on the output.
execFileSync(join(appDir, 'node_modules/.bin/biome'), ['format', '--write', outputFile], {
  stdio: ['ignore', 'ignore', 'inherit'],
});
console.log(
  `feature catalog: ${groups.length} groups, ${entries.length} entries → ${relative(appDir, outputFile)}`,
);
