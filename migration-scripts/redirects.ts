/**
 * Reads the redirect lists of both source versions and writes them unchanged, in source order, to
 * `src/lib/redirects.json` as `{ latest: [...], v2: [...] }`.
 * - latest: the `redirects` array in `src/server/redirects.mjs` of `tiptap-docs-main`
 * - v2: the array that `redirects()` returns in `next.config.mjs` of `tiptap-docs-v2`
 * Parses the files without running them. Stops with an error on an entry with a field other than
 * `source`, `destination` and `permanent`, or a value that is not a literal.
 *
 * Then checks the app redirects of `src/lib/app-redirects.mjs` against the copied pages in
 * `content/docs/` and `content/v2/`, and prints a note for each docs destination that is not a page
 * and each source that matches a page. Notes never stop the script.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { loadBindings, parse as parseJs } from 'next/dist/build/swc/index.js';
import { versionRedirects } from '../src/lib/app-redirects.mjs';

const appDir = dirname(import.meta.dirname);
const sourcesDir = join(import.meta.dirname, '.sources');
const outputFile = join(appDir, 'src/lib/redirects.json');

type EsNode = { type: string; [key: string]: unknown };
export type Redirect = { source: string; destination: string; permanent: boolean };

const fieldTypes: Record<keyof Redirect, string> = {
  source: 'StringLiteral',
  destination: 'StringLiteral',
  permanent: 'BooleanLiteral',
};

/** Returns the first node for which `test` is true, depth first. */
const find = (node: unknown, test: (node: EsNode) => boolean): EsNode | undefined => {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = find(child, test);
      if (found) return found;
    }
    return;
  }
  if (test(node as EsNode)) return node as EsNode;
  return find(Object.values(node), test);
};

const keyName = (key: EsNode) =>
  key.type === 'Identifier' || key.type === 'StringLiteral' ? (key.value as string) : undefined;

/** Reads an array literal of redirect objects. Throws on anything else. */
const readList = (label: string, array: EsNode | undefined): Redirect[] => {
  const fail = (message: string): never => {
    throw new Error(`${label}: ${message}`);
  };
  if (array?.type !== 'ArrayExpression') return fail('redirect list is not an array literal');
  return (array.elements as { spread?: unknown; expression: EsNode }[]).map((element, index) => {
    if (element.spread || element.expression.type !== 'ObjectExpression') {
      fail(`redirect ${index} is not an object literal`);
    }
    const entry: Record<string, unknown> = {};
    for (const property of element.expression.properties as EsNode[]) {
      if (property.type !== 'KeyValueProperty') fail(`redirect ${index} has a ${property.type}`);
      const field = keyName(property.key as EsNode) ?? fail(`redirect ${index} has a computed key`);
      const type =
        fieldTypes[field as keyof Redirect] ??
        fail(`redirect ${index} has an unknown field "${field}"`);
      const value = property.value as EsNode;
      if (value.type !== type) fail(`redirect ${index} field "${field}" is not a ${type}`);
      entry[field] = value.value;
    }
    for (const field of Object.keys(fieldTypes)) {
      if (!(field in entry)) fail(`redirect ${index} has no field "${field}"`);
    }
    return entry as Redirect;
  });
};

const parseFile = async (file: string) =>
  parseJs(readFileSync(file, 'utf8'), {
    isModule: true,
    filename: file,
    jsc: { parser: { syntax: 'ecmascript' } },
  });

await loadBindings();

const latestLabel = 'tiptap-docs-main/src/server/redirects.mjs';
const latestProgram = await parseFile(join(sourcesDir, latestLabel));
const latestDeclarator = find(
  latestProgram,
  (node) =>
    node.type === 'VariableDeclarator' &&
    (node.id as EsNode).type === 'Identifier' &&
    (node.id as EsNode).value === 'redirects',
);
const latest = readList(latestLabel, latestDeclarator?.init as EsNode | undefined);

const v2Label = 'tiptap-docs-v2/next.config.mjs';
const v2Program = await parseFile(join(sourcesDir, v2Label));
const v2Method = find(
  v2Program,
  (node) =>
    (node.type === 'MethodProperty' || node.type === 'KeyValueProperty') &&
    keyName(node.key as EsNode) === 'redirects',
);
const v2Return = find(v2Method, (node) => node.type === 'ReturnStatement');
const v2 = readList(v2Label, v2Return?.argument as EsNode | undefined);

writeFileSync(outputFile, `${JSON.stringify({ latest, v2 }, null, 2)}\n`);
console.log(`Wrote redirects: latest ${latest.length}, v2 ${v2.length}`);

/** Returns the URL paths of the pages in a content folder. Files and folders starting with `_` are no pages. */
const pagePaths = (dir: string, route: string) =>
  (readdirSync(dir, { recursive: true, encoding: 'utf8' }) as string[])
    .map((file) => file.split('\\').join('/'))
    .filter(
      (file) => file.endsWith('.mdx') && !file.split('/').some((part) => part.startsWith('_')),
    )
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '').replace(/(^|\/)index$/, '');
      return slug ? `${route}/${slug}` : route;
    })
    .sort();

/** Returns a regex for a Next.js redirect source. Supports `:name` and `:name*` only. */
const sourcePattern = (source: string) =>
  new RegExp(
    `^${source
      .split('/')
      .slice(1)
      .map((segment) => {
        if (/^:\w+\*$/.test(segment)) return '(?:/[^/]+)*';
        if (/^:\w+$/.test(segment)) return '/[^/]+';
        if (/[:*+?()]/.test(segment))
          throw new Error(`redirect source "${source}": unknown pattern`);
        return `/${segment.replace(/[.\\[\]{}^$|]/g, '\\$&')}`;
      })
      .join('')}$`,
  );

const notes: string[] = [];
for (const version of versionRedirects(appDir)) {
  const pages = pagePaths(join(appDir, version.dir), version.route);
  const pageSet = new Set(pages);
  for (const { source, destination } of version.redirects) {
    const pattern = sourcePattern(source);
    for (const page of pages.filter((path) => pattern.test(path))) {
      notes.push(`${version.name}: source "${source}" matches the page ${page}`);
    }
    const path = destination.replace(/[?#].*$/, '').replace(/(.)\/$/, '$1');
    if (path.startsWith('/') && !path.includes(':') && !pageSet.has(path)) {
      notes.push(
        `${version.name}: destination "${destination}" (source "${source}") is not a page`,
      );
    }
  }
}
console.log(`Redirect notes: ${notes.length}`);
for (const note of notes) console.log(`  ${note}`);
