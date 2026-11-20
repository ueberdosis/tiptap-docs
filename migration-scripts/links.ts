/**
 * Rewrites root links (`/…`) and `#anchor` links on the copied pages in `content/docs/` (latest) and
 * `content/v2/` (v2), so they open the right page and heading in this app. Expects the fresh output
 * of `copy.ts` and the redirect list from `redirects.ts`.
 *
 * Reads Markdown links, Markdown reference definitions and the link props of HTML tags and
 * components. Changes only the link target. The rest of each file stays byte for byte the same.
 * Code blocks, inline code and `{…}` expressions are not links.
 *
 * Headings of files a page includes with `<include>` count as headings of that page.
 * A heading's id is its custom id (`[#id]`) if it has one. An anchor in the old id format, or the id
 * a heading would have without its custom id, gets the heading's id.
 * On latest pages, a root link to a file that `public-assets.ts` copies gets `/docs` like a page link.
 * A link it cannot resolve, page or anchor, stays as it is. Prints the number of rewritten links per
 * version and every link it cannot resolve. Stops with an error on a link prop that is not one string
 * literal. Writes the files only after all pages pass.
 *
 * Importing the file runs nothing. `resolvePageLink` resolves one link the same way.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { remarkHeading } from 'fumadocs-core/mdx-plugins';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { docsRoute, docsV2Route } from '../src/lib/shared.ts';
import { oldSlug } from './heading-ids.ts';
import { publicAssetPaths } from './public-assets.ts';
import type { Redirect } from './redirects.ts';

const appDir = dirname(import.meta.dirname);

const versions = [
  { name: 'latest', dir: 'content/docs', route: docsRoute, publicFiles: true },
  { name: 'v2', dir: 'content/v2', route: docsV2Route, publicFiles: false },
];

/** JSX props that hold a page link. */
const linkProps = new Set(['href', 'documentationUrl', 'secondaryUrl']);

// Minimal shapes of the mdast, MDX and estree nodes this script reads.
type Position = { start: { offset: number }; end: { offset: number } };
type MdNode = {
  type: string;
  name?: string | null;
  url?: string;
  value?: unknown;
  depth?: number;
  position?: Position;
  children?: MdNode[];
  attributes?: MdNode[];
  data?: { estree?: EsNode; hProperties?: { id?: string } };
};
type EsNode = { type: string; start: number; end: number; [key: string]: unknown };
type Edit = { start: number; end: number; text: string };

const parser = remark().use(remarkFrontmatter).use(remarkGfm).use(remarkMdx);
const addHeadingIds = remarkHeading({ generateToc: false }) as (
  tree: unknown,
  file: unknown,
) => void;
const addDefaultHeadingIds = remarkHeading({ generateToc: false, customId: false }) as (
  tree: unknown,
  file: unknown,
) => void;

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

type Page = {
  file: string;
  label: string;
  source: string;
  tree: MdNode;
  /** Heading ids of this app, plus `id` props on HTML tags. */
  ids: Set<string>;
  /** Old heading id → heading id of this app, for the first heading with that old id. */
  oldIds: Map<string, string>;
  /** Id a heading would have without its custom id (`[#id]`) → its custom id. */
  defaultIds: Map<string, string>;
};

/** Returns the path of a page in its version, without the leading slash. `index` is the folder. */
const pagePath = (file: string, dir: string) =>
  relative(join(appDir, dir), file)
    .split('\\')
    .join('/')
    .replace(/\.mdx$/, '')
    .replace(/(^|\/)index$/, '');

/**
 * Replaces each `<include>` of an `.mdx` file in `tree` with the parsed content of that file, as the
 * Fumadocs `<include>` does. Changes `tree`. Positions in included nodes point into the other file.
 */
const expandIncludes = (file: string, tree: MdNode): MdNode => {
  const includePath = (node: MdNode) => {
    const target =
      node.type === 'paragraph' && node.children?.length === 1 ? node.children[0] : node;
    if (!target.type.startsWith('mdxJsx') || target.name !== 'include') return undefined;
    const path = flattenText(target).trim();
    if (!path.endsWith('.mdx'))
      throw new Error(`${relative(appDir, file)}: unknown include "${path}"`);
    return join(dirname(file), path);
  };
  const visit = (node: MdNode) => {
    if (!node.children) return;
    node.children = node.children.flatMap((child) => {
      const path = includePath(child);
      if (!path) return [child];
      return (
        expandIncludes(path, parser.parse(readFileSync(path, 'utf8')) as MdNode).children ?? []
      );
    });
    node.children.forEach(visit);
  };
  visit(tree);
  return tree;
};

const readPage = (file: string): Page => {
  const label = relative(appDir, file);
  const source = readFileSync(file, 'utf8');
  const tree = parser.parse(source) as MdNode;
  // Headings of included files are on the page too.
  const headingTree = expandIncludes(file, structuredClone(tree));
  const ids = new Set<string>();
  const visit = (node: MdNode) => {
    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      for (const attribute of node.attributes ?? []) {
        if (attribute.type === 'mdxJsxAttribute' && attribute.name === 'id') {
          if (typeof attribute.value === 'string') ids.add(attribute.value);
        }
      }
    }
    node.children?.forEach(visit);
  };
  visit(headingTree);

  // `remarkHeading` changes the tree, so it runs on a clone. It reads custom ids (`[#id]`) and
  // removes them from the heading text.
  const clone = structuredClone(headingTree);
  addHeadingIds(clone, {});
  const oldIds = new Map<string, string>();
  const realIds: string[] = [];
  const collect = (node: MdNode) => {
    if (node.type === 'heading') {
      const id = node.data?.hProperties?.id as string;
      ids.add(id);
      realIds.push(id);
      const old = oldSlug(label, flattenText(node));
      if (!oldIds.has(old)) oldIds.set(old, id);
    }
    node.children?.forEach(collect);
  };
  collect(clone);

  // The ids without custom ids, from a clone without the `[#id]` text and without the ids above.
  const plain = structuredClone(clone);
  const headings: MdNode[] = [];
  const reset = (node: MdNode) => {
    if (node.type === 'heading') {
      headings.push(node);
      delete node.data?.hProperties?.id;
    }
    node.children?.forEach(reset);
  };
  reset(plain);
  addDefaultHeadingIds(plain, {});
  const defaultIds = new Map<string, string>();
  headings.forEach((heading, index) => {
    const id = heading.data?.hProperties?.id as string;
    if (id !== realIds[index] && !ids.has(id)) defaultIds.set(id, realIds[index]);
  });
  return { file, label, source, tree, ids, oldIds, defaultIds };
};

/** Returns a regex for a Next.js redirect source. Supports `:name` and `:name*` only. */
const sourcePattern = (source: string) => {
  const pattern = source
    .split('/')
    .slice(1)
    .map((segment) => {
      const param = /^:(\w+)(\*)?$/.exec(segment);
      if (param) return param[2] ? `(?<${param[1]}>(?:/[^/]+)*)` : `/(?<${param[1]}>[^/]+)`;
      if (/[:*+?()]/.test(segment)) throw new Error(`redirect source "${source}": unknown pattern`);
      return `/${segment.replace(/[.\\[\]{}^$|]/g, '\\$&')}`;
    })
    .join('');
  return new RegExp(`^${pattern || '/'}$`);
};

/** Fills the params of a matched redirect into its destination. */
const fillDestination = (destination: string, groups: Record<string, string>) =>
  destination.replace(/\/:(\w+)(\*)?/g, (_, name: string, star?: string) => {
    const value = groups[name];
    if (value === undefined) throw new Error(`redirect "${destination}": unknown param "${name}"`);
    return star ? value : `/${value}`;
  }) || '/';

/** Reads the pages and redirects of a version. */
const loadVersion = (
  version: (typeof versions)[number],
  redirectLists: Record<string, Redirect[]>,
) => {
  const files = walkFiles(join(appDir, version.dir))
    .filter((file) => file.endsWith('.mdx'))
    .sort();
  const pages = new Map(files.map((file) => [pagePath(file, version.dir), readPage(file)]));
  const redirects = (redirectLists[version.name] ?? []).map((redirect) => ({
    pattern: sourcePattern(redirect.source),
    destination: redirect.destination,
  }));
  const assetPaths = new Set(version.publicFiles ? publicAssetPaths() : []);
  return { ...version, pages, redirects, assetPaths };
};

type Version = ReturnType<typeof loadVersion>;

let loaded: Version[] | undefined;
/** Reads all versions on first use. */
const loadVersions = () => {
  if (!loaded) {
    const redirectLists: Record<string, Redirect[]> = JSON.parse(
      readFileSync(join(appDir, 'src/lib/redirects.json'), 'utf8'),
    );
    loaded = versions.map((version) => loadVersion(version, redirectLists));
  }
  return loaded;
};

/** Follows the redirects of a version. Returns the final path and the anchor of the last redirect. */
const followRedirects = (version: Version, path: string) => {
  let current = path;
  let anchor: string | undefined;
  for (let step = 0; step <= 10; step += 1) {
    const redirect = version.redirects.find(({ pattern }) => pattern.test(current));
    if (!redirect) return { path: current, anchor };
    if (step === 10) throw new Error(`${version.name}: more than 10 redirects for "${path}"`);
    const groups = redirect.pattern.exec(current)?.groups ?? {};
    const destination = fillDestination(redirect.destination, groups);
    const hash = destination.indexOf('#');
    current = hash === -1 ? destination : destination.slice(0, hash);
    if (hash !== -1) anchor = destination.slice(hash + 1);
  }
  return { path: current, anchor };
};

/** Returns the page key for a URL path, after redirects, or undefined. */
const findPage = (version: Version, path: string) => {
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path;
  const followed = followRedirects(version, normalized);
  const key = followed.path.replace(/^\//, '');
  if (version.pages.has(key)) return { key, anchor: followed.anchor };
  return undefined;
};

/** Returns the URL path of a public file for a URL path, after redirects, or undefined. */
const findFile = (version: Version, path: string) => {
  const followed = followRedirects(version, path);
  return version.assetPaths.has(followed.path) ? followed.path : undefined;
};

export type Result = { kind: 'ok'; text: string } | { kind: 'unresolved'; reason: string };

/** Returns the anchor to write, or undefined if the page has no such heading or id. */
const resolveAnchor = (page: Page, anchor: string) => {
  if (page.ids.has(anchor)) return anchor;
  return page.oldIds.get(anchor) ?? page.defaultIds.get(anchor);
};

const resolveLink = (version: Version, current: Page, link: string): Result => {
  const hashIndex = link.indexOf('#');
  const beforeHash = hashIndex === -1 ? link : link.slice(0, hashIndex);
  let anchor = hashIndex === -1 ? undefined : link.slice(hashIndex + 1);
  const queryIndex = beforeHash.indexOf('?');
  const path = queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : beforeHash.slice(queryIndex);

  let page: Page;
  let url: string;
  if (path === '') {
    page = current;
    url = '';
  } else {
    let found = findPage(version, path);
    if (!found && path.startsWith('/docs/')) found = findPage(version, path.slice('/docs'.length));
    if (!found) {
      let file = findFile(version, path);
      if (!file && path.startsWith('/docs/')) file = findFile(version, path.slice('/docs'.length));
      if (!file) return { kind: 'unresolved', reason: 'page not found' };
      if (anchor !== undefined) return { kind: 'unresolved', reason: 'anchor on a file' };
      return { kind: 'ok', text: `${version.route}${file}${query}` };
    }
    page = version.pages.get(found.key) as Page;
    url = found.key ? `${version.route}/${found.key}` : version.route;
    if (anchor === undefined) anchor = found.anchor;
  }

  if (anchor === undefined || anchor === '') {
    return { kind: 'ok', text: `${url}${query}${anchor === '' ? '#' : ''}` };
  }
  const newAnchor = resolveAnchor(page, anchor);
  if (newAnchor === undefined) return { kind: 'unresolved', reason: `anchor not found` };
  return { kind: 'ok', text: `${url}${query}#${newAnchor}` };
};

/**
 * Resolves a root or `#anchor` link as this script does, for a link on the page `file` (absolute
 * path) of the version `versionName`. Reads the pages on disk on first use.
 */
export const resolvePageLink = (versionName: string, file: string, link: string): Result => {
  const version = loadVersions().find(({ name }) => name === versionName);
  const page = [...(version?.pages.values() ?? [])].find((item) => item.file === file);
  if (!version || !page) throw new Error(`${relative(appDir, file)}: not a page of ${versionName}`);
  return resolveLink(version, page, link);
};

type LinkKind = 'root' | 'anchor' | 'relative' | 'external';
const linkKind = (link: string): LinkKind => {
  if (link.startsWith('#')) return 'anchor';
  if (link.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(link)) return 'external';
  if (link.startsWith('/')) return 'root';
  return 'relative';
};

/** Returns the offset of the URL of a Markdown link or definition. Throws if it cannot find it. */
const urlOffset = (label: string, source: string, node: MdNode) => {
  const start = (node.position as Position).start.offset;
  const end = (node.position as Position).end.offset;
  const url = node.url as string;
  let offset: number;
  if (node.type === 'definition') {
    const match = /^\[(?:[^\]\\]|\\.)*\]:[ \t]*\n?[ \t]*<?/.exec(source.slice(start, end));
    offset = match ? start + match[0].length : -1;
  } else {
    const lastChild = node.children?.at(-1);
    const textEnd = lastChild ? (lastChild.position as Position).end.offset : start + 1;
    const match = /^[^\]]*\]\([ \t]*\n?[ \t]*<?/.exec(source.slice(textEnd, end));
    offset = match ? textEnd + match[0].length : -1;
  }
  if (offset === -1 || !source.startsWith(url, offset)) {
    throw new Error(`${label}: cannot find the target "${url}" of a link in the source`);
  }
  return offset;
};

/**
 * Returns the string and its offset of a link prop value in estree: a string literal, or a
 * `{…}` with one string literal. Throws on anything else.
 */
const estreeLinkValue = (fail: (message: string) => never, value: EsNode | null) => {
  const literal =
    value?.type === 'JSXExpressionContainer' ? (value.expression as EsNode) : (value ?? undefined);
  if (literal?.type !== 'Literal' || typeof literal.value !== 'string') {
    return fail('is not one string');
  }
  const raw = literal.raw as string;
  if (raw.slice(1, -1) !== literal.value) fail('has a string the script cannot read');
  return { link: literal.value, offset: literal.start + 1 };
};

/** Calls `found` for every JSX link prop inside an estree node. */
const visitJsxLinkProps = (
  label: string,
  node: unknown,
  found: (link: string, offset: number) => void,
) => {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) visitJsxLinkProps(label, child, found);
    return;
  }
  const value = node as EsNode;
  if (value.type === 'JSXAttribute') {
    const name = (value.name as EsNode).name as string;
    if (linkProps.has(name)) {
      const fail = (message: string): never => {
        throw new Error(`${label}: a "${name}" inside a {…} expression ${message}`);
      };
      const { link, offset } = estreeLinkValue(fail, value.value as EsNode | null);
      found(link, offset);
      return;
    }
  }
  for (const [key, child] of Object.entries(value)) {
    if (key !== 'loc' && key !== 'range') visitJsxLinkProps(label, child, found);
  }
};

const main = () => {
  const outputs = new Map<string, string>();
  const unresolved: string[] = [];
  const summary: string[] = [];

  for (const version of loadVersions()) {
    const counts = {
      rewritten: 0,
      anchors: 0,
      unchanged: 0,
      unresolved: 0,
      relative: 0,
      external: 0,
    };

    for (const page of version.pages.values()) {
      const { label, source } = page;
      const edits: Edit[] = [];

      /** `offset` is a number or a function that returns it, for links that need an edit. */
      const handle = (link: string, offset: number | (() => number)) => {
        const kind = linkKind(link);
        if (kind === 'relative' || kind === 'external') {
          counts[kind] += 1;
          return;
        }
        const start = typeof offset === 'number' ? offset : offset();
        if (!source.startsWith(link, start)) {
          throw new Error(`${label}: cannot find the link "${link}" in the source`);
        }
        const result = resolveLink(version, page, link);
        if (result.kind === 'unresolved') {
          counts.unresolved += 1;
          unresolved.push(`${version.name}  ${label}  ${link}  (${result.reason})`);
          return;
        }
        if (result.text === link) {
          counts.unchanged += 1;
          return;
        }
        counts.rewritten += 1;
        const oldAnchor = link.split('#')[1];
        if (oldAnchor && result.text.split('#')[1] !== oldAnchor) counts.anchors += 1;
        edits.push({ start, end: start + link.length, text: result.text });
      };

      const visit = (node: MdNode) => {
        switch (node.type) {
          case 'code':
          case 'inlineCode':
            return;
          case 'mdxFlowExpression':
          case 'mdxTextExpression':
          case 'mdxjsEsm':
            visitJsxLinkProps(label, node.data?.estree, handle);
            return;
          case 'link':
          case 'definition':
            handle(node.url as string, () => urlOffset(label, source, node));
            break;
          case 'mdxJsxFlowElement':
          case 'mdxJsxTextElement':
            for (const attribute of node.attributes ?? []) {
              if (attribute.type !== 'mdxJsxAttribute') {
                visitJsxLinkProps(label, attribute.data?.estree, handle);
                continue;
              }
              const valueNode = attribute.value as MdNode | string | null;
              const name = attribute.name as string;
              if (name === 'moreLink' && typeof valueNode === 'object') {
                const fail = (message: string): never => {
                  throw new Error(`${label}: <${node.name}> has a "moreLink" that ${message}`);
                };
                const body = (valueNode?.data?.estree?.body ?? []) as EsNode[];
                const object = body[0]?.expression as EsNode | undefined;
                if (body.length !== 1 || object?.type !== 'ObjectExpression')
                  fail('is not an object');
                const url = ((object as EsNode).properties as EsNode[]).find(
                  (property) => ((property.key as EsNode | undefined)?.name as string) === 'url',
                );
                if (!url) fail('has no "url"');
                const { link, offset } = estreeLinkValue(fail, (url as EsNode).value as EsNode);
                handle(link, offset);
                continue;
              }
              if (!linkProps.has(name)) {
                if (typeof valueNode === 'object') {
                  visitJsxLinkProps(label, valueNode?.data?.estree, handle);
                }
                continue;
              }
              const attributeStart = (attribute.position as Position).start.offset;
              if (typeof valueNode === 'string') {
                const quote = source[attributeStart + name.length + 1];
                const offset = attributeStart + name.length + 2;
                if (
                  source.slice(attributeStart, offset - 1) !== `${name}=` ||
                  (quote !== '"' && quote !== "'") ||
                  !source.startsWith(valueNode, offset)
                ) {
                  throw new Error(
                    `${label}: <${node.name}> has a "${name}" the script cannot read`,
                  );
                }
                handle(valueNode, offset);
                continue;
              }
              const body = (valueNode?.data?.estree?.body ?? []) as EsNode[];
              const fail = (message: string): never => {
                throw new Error(`${label}: <${node.name}> has a "${name}" that ${message}`);
              };
              if (body.length !== 1) fail('is not one string');
              const { link, offset } = estreeLinkValue(fail, body[0].expression as EsNode);
              handle(link, offset);
            }
            break;
        }
        node.children?.forEach(visit);
      };
      visit(page.tree);

      if (edits.length > 0) {
        let output = source;
        for (const edit of [...edits].sort((a, b) => b.start - a.start)) {
          output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
        }
        outputs.set(page.file, output);
      }
    }

    summary.push(
      `${version.dir}: ${counts.rewritten} rewritten (${counts.anchors} with a new anchor), ` +
        `${counts.unchanged} already correct, ` +
        `${counts.unresolved} unresolved, ${counts.relative} relative and ` +
        `${counts.external} external unchanged`,
    );
  }

  unresolved.sort();
  console.log(summary.join('\n'));
  if (unresolved.length > 0) {
    console.log(
      `Unresolved links, kept as they are (${unresolved.length}):\n${unresolved.join('\n')}`,
    );
  }

  for (const [file, content] of outputs) writeFileSync(file, content);
  console.log(`Changed ${outputs.size} pages`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
