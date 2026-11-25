/**
 * Reads the sidebars of both source versions and writes one navigation file per version:
 * `src/lib/navigation/latest.json` and `src/lib/navigation/v2.json`. Expects the fresh output of
 * `copy.ts`, because each link must be an imported page.
 *
 * Runs the source sidebar code as it is: compiles the `sidebar.ts` files and what they import with
 * the installed `tsc` into `.sources/sidebars-<version>/`, then runs the result (`run-source.ts`).
 *
 * Each tab of the file is one source sidebar, in this order:
 * - latest: `src/content/sidebar.ts` (Documentation) and `src/content/ui-components/sidebar.ts`
 *   (UI Components)
 * - v2: every `src/content/**\/sidebar.ts`, sorted by path. The tab title is the sidebar `title`.
 * A tab links to the sidebar `rootHref`. Its `scope` is the URL of the sidebar's folder: a page shows
 * the tab with the longest scope that its URL starts with, like the nearest `sidebar.ts` in the
 * source.
 *
 * Each entry keeps the source title, order and nesting. Links become app URLs with
 * `resolvePageLink` from `links.ts`. Labels follow the old sidebar of the version:
 * - latest: at most one label, the first of Deprecated, Paid (any paid plan), Open source. A plan
 *   label is left out on `hidePlan`. `newSince` stays a date; the app shows "New" from it.
 * - v2: "Beta" for `beta`, then every tag as it is.
 *
 * Stops with an error that names the sidebar and the entry on an unknown field, a value of the
 * wrong type, or a link that is not an imported page. An `http(s)` link is external.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import type { Navigation, NavigationEntry, NavigationTab } from '../src/lib/navigation.tsx';
import { docsRoute, docsV2Route } from '../src/lib/shared.ts';
import { resolvePageLink } from './links.ts';
import { runSourceExport } from './run-source.ts';

const appDir = dirname(import.meta.dirname);
const sourcesDir = join(import.meta.dirname, '.sources');
const outputDir = join(appDir, 'src/lib/navigation');

type Value = string | boolean | Value[] | { [key: string]: Value } | undefined;
type Raw = Record<string, Value>;

type Version = {
  name: 'latest' | 'v2';
  folder: string;
  /** Sidebar files relative to the clone, with the tab title, or undefined for the source title. */
  sidebars: { file: string; title?: string }[];
  fields: { config: string[]; group: string[]; link: string[] };
  labels: (entry: Raw, where: string) => string[];
};

// Latest: one label per entry, ranked, as `sidebarLabel` in `src/components/SidebarRenderer.tsx`.
const latestLabels: Record<string, { text: string; plan?: boolean }> = {
  deprecated: { text: 'Deprecated' },
  paid: { text: 'Paid', plan: true },
  start: { text: 'Paid', plan: true },
  starter: { text: 'Paid', plan: true },
  team: { text: 'Paid', plan: true },
  business: { text: 'Paid', plan: true },
  'add-on': { text: 'Paid', plan: true },
  'pilot program': { text: 'Paid', plan: true },
  'open source': { text: 'Open source' },
};
const latestRank = ['Deprecated', 'Paid', 'Open source'];

const versions: Version[] = [
  {
    name: 'latest',
    folder: 'tiptap-docs-main',
    sidebars: [
      { file: 'src/content/sidebar.ts', title: 'Documentation' },
      { file: 'src/content/ui-components/sidebar.ts', title: 'UI Components' },
    ],
    fields: {
      config: ['id', 'rootHref', 'title', 'items'],
      group: ['type', 'title', 'href', 'tags', 'children', 'collapsible', 'defaultOpen', 'divider'],
      link: [
        'type',
        'title',
        'href',
        'tags',
        'newSince',
        'hidePlan',
        'external',
        'disabled',
        'children',
        'isActive',
        'defaultOpen',
      ],
    },
    labels: (entry, where) => {
      const tags = strings(entry.tags, `${where} tags`);
      const found = tags
        .map((tag) => latestLabels[tag.toLowerCase()])
        .filter((label) => label && !(entry.hidePlan === true && label.plan))
        .map((label) => label.text)
        .sort((a, b) => latestRank.indexOf(a) - latestRank.indexOf(b));
      return found.slice(0, 1);
    },
  },
  {
    name: 'v2',
    folder: 'tiptap-docs-v2',
    sidebars: [],
    fields: {
      config: ['id', 'rootHref', 'title', 'items'],
      group: ['type', 'title', 'href', 'tags', 'children'],
      link: ['type', 'title', 'href', 'tags', 'beta', 'external', 'children', 'isActive'],
    },
    labels: (entry, where) => [
      ...(entry.beta === true ? ['Beta'] : []),
      ...strings(entry.tags, `${where} tags`),
    ],
  },
];

/** Source settings the navigation cannot express. Printed at the end. */
const notes: string[] = [];
/**
 * Sidebar links to pages that the source does not have, approved to be left out of the menu.
 * Any other missing page stops the script.
 */
const knownMissing: { version: string; sidebar: string; href: string; seen?: boolean }[] = [
  {
    version: 'v2',
    sidebar: 'src/content/examples/sidebar.ts',
    href: '/examples/experiments/ai-agent',
  },
];
/** Links that are not imported pages. The script stops after it has checked all sidebars. */
const missing: string[] = [];

const fail = (message: string): never => {
  throw new Error(message);
};

const strings = (value: Value, where: string): string[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    return fail(`${where} is not a list of strings`);
  }
  return value as string[];
};

const optional = (entry: Raw, field: string, type: 'string' | 'boolean', where: string) => {
  const value = entry[field];
  if (value !== undefined && typeof value !== type)
    fail(`${where} field "${field}" is not a ${type}`);
  return value;
};

/** Every `sidebar.ts` in `src/content/` of a clone, sorted, relative to the clone. */
const findSidebars = (clone: string) =>
  readdirSync(join(clone, 'src/content'), { recursive: true, encoding: 'utf8' })
    .filter((file) => file === 'sidebar.ts' || file.endsWith('/sidebar.ts'))
    .map((file) => `src/content/${file}`)
    .sort();

/** Compiles the sidebars and runs them. Returns their `sidebarConfig` values by file. */
const runSidebars = (version: Version, clone: string, files: string[]) =>
  runSourceExport(`sidebars-${version.name}`, clone, files, 'sidebarConfig') as Record<string, Raw>;

const checkFields = (entry: Raw, allowed: string[], where: string) => {
  for (const field of Object.keys(entry)) {
    if (!allowed.includes(field)) fail(`${where} has an unknown field "${field}"`);
  }
};

type Context = { version: Version; indexFile: string; sidebar: string };

/** Resolves a source href to an app URL, or undefined for a known missing page. */
const resolveHref = (context: Context, href: string, where: string) => {
  if (/^https?:\/\//.test(href)) return { url: href, external: true };
  if (!href.startsWith('/')) fail(`${where} href "${href}" is not a root link`);
  const result = resolvePageLink(context.version.name, context.indexFile, href);
  if (result.kind === 'ok') return { url: result.text, external: /^https?:\/\//.test(result.text) };
  const known = knownMissing.find(
    (item) =>
      item.version === context.version.name &&
      item.sidebar === context.sidebar &&
      item.href === href,
  );
  if (known) {
    known.seen = true;
    notes.push(`${where} href "${href}": ${result.reason}; left out`);
  } else {
    missing.push(`${where} href "${href}": ${result.reason}`);
  }
  return undefined;
};

const convertLinks = (context: Context, entries: Raw[], where: string) =>
  entries
    .map((entry) => convertLink(context, entry, where))
    .filter((entry): entry is NavigationEntry => entry !== undefined);

/** Converts one link and its children. Returns undefined for a known missing page. */
const convertLink = (context: Context, entry: Raw, where: string): NavigationEntry | undefined => {
  const { version } = context;
  checkFields(entry, version.fields.link, where);
  if (entry.type !== undefined && entry.type !== 'link') fail(`${where} has type "${entry.type}"`);
  const title = optional(entry, 'title', 'string', where) ?? fail(`${where} has no title`);
  const label = `${where} › ${title}`;
  const href =
    (optional(entry, 'href', 'string', label) as string | undefined) ??
    fail(`${label} has no href`);
  for (const field of ['hidePlan', 'external', 'disabled', 'isActive', 'beta', 'defaultOpen']) {
    optional(entry, field, 'boolean', label);
  }
  if (entry.disabled === true) fail(`${label} is disabled; the script does not support that`);
  if (entry.isActive === true) fail(`${label} sets isActive; the script does not support that`);
  if (entry.isActive === false) notes.push(`${label}: isActive false is dropped`);
  if (entry.defaultOpen === true) notes.push(`${label}: defaultOpen is dropped`);
  const newSince = optional(entry, 'newSince', 'string', label) as string | undefined;
  if (newSince !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(newSince)) {
    fail(`${label} newSince "${newSince}" is not YYYY-MM-DD`);
  }
  if (entry.children !== undefined && !Array.isArray(entry.children)) {
    fail(`${label} children is not a list`);
  }
  const children = entry.children as Raw[] | undefined;
  if (href === '' && !children?.length) {
    fail(`${label} has neither href nor children`);
  }
  const target = href === '' ? undefined : resolveHref(context, href, label);
  if (href !== '' && !target) {
    if (children !== undefined) fail(`${label} is a missing page with children`);
    return undefined;
  }
  if (entry.external === true && !target?.external) fail(`${label} is external but not http(s)`);
  const labels = version.labels(entry, label);
  return {
    type: 'link',
    title: title as string,
    url: target?.url,
    external: target?.external || undefined,
    labels: labels.length ? labels : undefined,
    newSince,
    children: children && convertLinks(context, children, label),
  };
};

const convertGroup = (version: Version, entry: Raw, where: string): NavigationEntry => {
  checkFields(entry, version.fields.group, where);
  const title = optional(entry, 'title', 'string', where) ?? fail(`${where} has no title`);
  const label = `${where} › ${title}`;
  // The group href names the group in the source; the old sidebar does not link it.
  optional(entry, 'href', 'string', label);
  for (const field of ['collapsible', 'defaultOpen', 'divider']) {
    optional(entry, field, 'boolean', label);
  }
  if (!Array.isArray(entry.children)) fail(`${label} children is not a list`);
  const labels = version.labels(entry, label);
  return {
    type: 'group',
    title: title as string,
    labels: labels.length ? labels : undefined,
    collapsible: (entry.collapsible as boolean | undefined) || undefined,
    defaultOpen: (entry.defaultOpen as boolean | undefined) || undefined,
    divider: (entry.divider as boolean | undefined) || undefined,
    children: [],
  };
};

const navigations = versions.map((version) => {
  const clone = join(sourcesDir, version.folder);
  const sidebars = version.sidebars.length
    ? version.sidebars
    : findSidebars(clone).map((file) => ({ file, title: undefined }));
  const configs = runSidebars(
    version,
    clone,
    sidebars.map(({ file }) => file),
  );
  const indexFile = join(
    appDir,
    version.name === 'latest' ? 'content/docs' : 'content/v2',
    'index.mdx',
  );

  const tabs = sidebars.map(({ file, title }): NavigationTab => {
    const where = `${version.name} ${file}`;
    const config = configs[file] ?? fail(`${where} exports no sidebarConfig`);
    checkFields(config, version.fields.config, where);
    const items = config.items;
    if (!Array.isArray(items)) fail(`${where} items is not a list`);
    const sourceTitle = optional(config, 'title', 'string', where) as string;
    const rootHref =
      (optional(config, 'rootHref', 'string', where) as string | undefined) ??
      fail(`${where} has no rootHref`);
    const rootTarget = resolvePageLink(version.name, indexFile, rootHref);
    if (rootTarget.kind !== 'ok') fail(`${where} rootHref "${rootHref}": ${rootTarget.reason}`);
    const folder = dirname(file.slice('src/content/'.length));
    const route = version.name === 'latest' ? docsRoute : docsV2Route;
    const context: Context = { version, indexFile, sidebar: file };
    const entries = (items as Raw[]).flatMap((item) => {
      if (item.type === 'group') {
        const group = convertGroup(version, item, where);
        group.children = convertLinks(context, item.children as Raw[], `${where} › ${group.title}`);
        return [group];
      }
      return convertLinks(context, [item], where);
    });
    return {
      title: title ?? sourceTitle,
      source: file,
      url: (rootTarget as { text: string }).text,
      scope: folder === '.' ? route : `${route}/${folder}`,
      entries,
    };
  });
  return { version, tabs };
});

for (const item of knownMissing) {
  if (!item.seen)
    missing.push(
      `${item.version} ${item.sidebar} href "${item.href}": no longer in the sidebar or now a page; remove it from knownMissing`,
    );
}
if (missing.length) {
  console.error(`Sidebar links that are not imported pages:\n${missing.join('\n')}`);
  process.exit(1);
}

// Write only after both versions pass.
mkdirSync(outputDir, { recursive: true });
for (const { version, tabs } of navigations) {
  const file = join(outputDir, `${version.name}.json`);
  writeFileSync(file, `${JSON.stringify({ tabs } satisfies Navigation, null, 2)}\n`);
  const count = (entries: NavigationEntry[]): number =>
    entries.reduce((sum, entry) => sum + 1 + count(entry.children ?? []), 0);
  console.log(
    `${version.name}: ${tabs.length} tabs, ${tabs.reduce((sum, tab) => sum + count(tab.entries), 0)} entries → ${relative(appDir, file)}`,
  );
}
// Format like the rest of the repository, so `pnpm lint` passes on the output.
execFileSync(
  join(appDir, 'node_modules/.bin/biome'),
  [
    'format',
    '--write',
    ...navigations.map(({ version }) => join(outputDir, `${version.name}.json`)),
  ],
  { stdio: ['ignore', 'ignore', 'inherit'] },
);
for (const note of notes) console.log(`Note: ${note}`);
