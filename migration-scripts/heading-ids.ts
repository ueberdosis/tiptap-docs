/**
 * Keeps the old docs' heading ids on the copied pages in `content/docs/` (latest) and `content/v2/`
 * (v2). Expects the fresh output of `copy.ts`.
 *
 * 1. Replaces each link inside a heading with its link text, and prints it with its page and URL.
 * 2. Appends Fumadocs' custom heading id (` [#old-id]`) to a heading whose old id differs from its
 *    Fumadocs id. Only the first heading with an old id on a page gets it. Headings of files a page
 *    includes with `<include>` count as headings of that page.
 *
 * Changes only these parts. The rest of each file stays byte for byte the same.
 * Stops with an error that names the page on a heading part other than text, inline code or a
 * link, a character without a rule, a heading that already ends with `[#…]`, an included heading
 * that pages need with different ids, and two headings with the same id on a page.
 * Writes the files only after all pages pass.
 *
 * Importing the file runs nothing. `oldSlug` returns the old id of one heading text.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { remarkHeading } from 'fumadocs-core/mdx-plugins';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { childrenSource, type MdNode, offsets } from './mdast.ts';

const appDir = dirname(import.meta.dirname);
const outputDirs = ['content/docs', 'content/v2'];

/** Same shape as Fumadocs' `headingIdRegex`: a custom id at the end of the heading text. */
const customIdPattern = /\s*\[#([\s\S]+?)]\s*$/;

const parser = remark().use(remarkFrontmatter).use(remarkGfm).use(remarkMdx);
const addHeadingIds = remarkHeading({ generateToc: false }) as (
  tree: unknown,
  file: unknown,
) => void;

type Heading = MdNode & { depth: number; data?: { hProperties?: { id?: string } } };
type Edit = { start: number; end: number; text: string };

const walkFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walkFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );

const flattenText = (node: MdNode): string =>
  node.children
    ? node.children.map(flattenText).join('')
    : typeof node.value === 'string'
      ? node.value
      : '';

/**
 * The `charMap` entries of `slugify` 1.6.6 for all ASCII characters and for the other characters
 * that the headings use. An empty string means `slugify` has no entry, so it removes the character.
 * Surrogate halves (emoji) have no entry either.
 */
const slugifyCharMap: Record<string, string> = {
  $: 'dollar',
  '%': 'percent',
  '&': 'and',
  '<': 'less',
  '>': 'greater',
  '|': 'or',
  '–': '-',
  '—': '',
  '’': "'",
  '…': '...',
  '→': '',
};

/**
 * The old app's heading id: `slugify(text, { strict: true, lower: true })`. Throws on a non-ASCII
 * character without a rule, naming `label`.
 */
export const oldSlug = (label: string, text: string) => {
  let slug = '';
  for (const char of text.normalize().split('')) {
    let mapped = slugifyCharMap[char];
    if (mapped === undefined) {
      const code = char.charCodeAt(0);
      if (code >= 0xd800 && code <= 0xdfff) continue;
      if (code > 127) {
        throw new Error(`${label}: heading "${text}" has a character without a rule: "${char}"`);
      }
      mapped = char;
    }
    if (mapped === '-') mapped = ' ';
    slug += mapped.replace(/[^\w\s$*_+~.()'"!\-:@]+/g, '');
  }
  return slug
    .replace(/[^A-Za-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
};

/** Returns the headings of a tree in document order. */
const headingsOf = (tree: MdNode): Heading[] => {
  const headings: Heading[] = [];
  const visit = (node: MdNode) => {
    if (node.type === 'heading') headings.push(node as Heading);
    node.children?.forEach(visit);
  };
  visit(tree);
  return headings;
};

const isFragment = (file: string) => file.split(sep).includes('_shared');

/** Returns the edits that replace each link in a heading with its link text. */
const linkEdits = (label: string, source: string, tree: MdNode, removed: string[]) => {
  const edits: Edit[] = [];
  for (const heading of headingsOf(tree)) {
    const visit = (node: MdNode) => {
      if (!['text', 'inlineCode', 'link'].includes(node.type)) {
        throw new Error(`${label}: heading "${flattenText(heading)}" has a ${node.type}`);
      }
      if (node.type === 'link') {
        const url = (node as MdNode & { url: string }).url;
        removed.push(`${label}  ${url}`);
        edits.push({ ...offsets(node), text: childrenSource(source, node) });
      }
      node.children?.forEach(visit);
    };
    heading.children?.forEach(visit);
  }
  return edits;
};

const applyEdits = (source: string, edits: Edit[]) => {
  let output = source;
  for (const edit of [...edits].sort((a, b) => b.start - a.start)) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }
  return output;
};

/** A heading of a page, with the file it is in. Included files keep their own positions. */
type PageHeading = { file: string; heading: Heading };

/** Returns the page tree with each `<include>` replaced by the included file, as Fumadocs does. */
const expandPage = (file: string, sources: Map<string, string>) => {
  const owners = new Map<MdNode, string>();
  const expand = (current: string): MdNode => {
    const source = sources.get(current);
    if (source === undefined) throw new Error(`${relative(appDir, file)}: unknown include`);
    const tree = parser.parse(source) as MdNode;
    for (const heading of headingsOf(tree)) owners.set(heading, current);
    const visit = (node: MdNode) => {
      if (!node.children) return;
      node.children = node.children.flatMap((child) => {
        const target =
          child.type === 'paragraph' && child.children?.length === 1 ? child.children[0] : child;
        if (!target.type.startsWith('mdxJsx') || target.name !== 'include') return [child];
        const path = flattenText(target).trim();
        return expand(join(dirname(current), path)).children ?? [];
      });
      node.children.forEach(visit);
    };
    visit(tree);
    return tree;
  };
  const tree = expand(file);
  const headings: PageHeading[] = headingsOf(tree).map((heading) => ({
    file: owners.get(heading) as string,
    heading,
  }));
  return { tree, headings };
};

/** Returns the Fumadocs id of each heading of `tree`, in order. Runs on a clone. */
const fumadocsIds = (tree: MdNode) => {
  const clone = structuredClone(tree);
  addHeadingIds(clone, {});
  return headingsOf(clone).map((heading) => heading.data?.hProperties?.id as string);
};

/** Key of a heading in its own file. */
const headingKey = (file: string, heading: Heading) => `${file}:${offsets(heading).start}`;

/** Runs the step on all pages and writes the changed files. */
const main = () => {
  // Pass 1: remove links in headings.
  const sources = new Map<string, string>();
  const removedLinks: string[] = [];
  for (const dir of outputDirs) {
    for (const file of walkFiles(join(appDir, dir))
      .filter((path) => path.endsWith('.mdx'))
      .sort()) {
      const label = relative(appDir, file);
      const source = readFileSync(file, 'utf8');
      const edits = linkEdits(label, source, parser.parse(source) as MdNode, removedLinks);
      sources.set(file, applyEdits(source, edits));
    }
  }

  // Pass 2: decide the custom ids per page. Included headings must get the same decision on each page.
  const pages = [...sources.keys()].filter((file) => !isFragment(file));
  const decisions = new Map<string, { id: string | null; page: string; end: number }>();
  /** Per page, the custom id of each heading in order, or null. */
  const expected = new Map<string, (string | null)[]>();
  const counts = new Map(outputDirs.map((dir) => [dir, { headings: 0, ids: 0, pages: new Set() }]));
  for (const page of pages) {
    const label = relative(appDir, page);
    const { tree, headings } = expandPage(page, sources);
    const ids = fumadocsIds(tree);
    const seen = new Set<string>();
    expected.set(page, []);
    headings.forEach(({ file, heading }, index) => {
      const fileLabel = relative(appDir, file);
      const last = heading.children?.at(-1);
      if (last?.type === 'text' && customIdPattern.test(String(last.value))) {
        throw new Error(`${fileLabel}: heading "${flattenText(heading)}" already ends with [#…]`);
      }
      const old = oldSlug(fileLabel, flattenText(heading));
      let id: string | null = null;
      if (old !== '' && !seen.has(old)) {
        seen.add(old);
        if (old !== ids[index]) id = old;
      }
      const key = headingKey(file, heading);
      const earlier = decisions.get(key);
      if (earlier && earlier.id !== id) {
        throw new Error(
          `${fileLabel}: heading "${flattenText(heading)}" needs the id ${earlier.id ?? 'of Fumadocs'} ` +
            `on ${earlier.page} and ${id ?? 'of Fumadocs'} on ${label}`,
        );
      }
      expected.get(page)?.push(id);
      decisions.set(key, {
        id,
        page: label,
        end: offsets(heading.children?.at(-1) ?? heading).end,
      });
    });
  }

  // Pass 3: append the custom ids.
  const idEdits = new Map<string, Edit[]>();
  for (const [key, { id, end }] of decisions) {
    if (id === null) continue;
    const file = key.slice(0, key.lastIndexOf(':'));
    idEdits.set(file, [...(idEdits.get(file) ?? []), { start: end, end, text: ` [#${id}]` }]);
  }
  for (const [file, edits] of idEdits) {
    sources.set(file, applyEdits(sources.get(file) as string, edits));
  }

  // Pass 4: check every page as Fumadocs reads it.
  for (const page of pages) {
    const label = relative(appDir, page);
    const { tree, headings } = expandPage(page, sources);
    const ids = fumadocsIds(tree);
    const used = new Set<string>();
    for (const id of ids) {
      if (used.has(id)) throw new Error(`${label}: two headings have the id "${id}"`);
      used.add(id);
    }
    const dir = outputDirs.find((outputDir) => label.startsWith(`${outputDir}/`)) as string;
    const count = counts.get(dir) as { headings: number; ids: number; pages: Set<unknown> };
    count.headings += headings.length;
    const pageIds = expected.get(page) as (string | null)[];
    if (pageIds.length !== headings.length) throw new Error(`${label}: headings changed`);
    pageIds.forEach((id, index) => {
      if (id && ids[index] !== id) throw new Error(`${label}: heading id "${id}" did not apply`);
      if (id) {
        count.ids += 1;
        count.pages.add(page);
      }
    });
  }

  let changed = 0;
  for (const [file, source] of sources) {
    if (source === readFileSync(file, 'utf8')) continue;
    writeFileSync(file, source);
    changed += 1;
  }
  for (const line of removedLinks) console.log(`Link in a heading replaced by its text: ${line}`);
  for (const [dir, count] of counts) {
    console.log(
      `${dir}: ${count.ids} old heading ids on ${count.pages.size} pages, ${count.headings} headings`,
    );
  }
  console.log(`Changed ${changed} files`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
