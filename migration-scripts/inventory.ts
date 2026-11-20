/**
 * Lists everything the source MDX pages use: components, HTML tags, props, frontmatter fields,
 * imports, exports and `{…}` expressions. Reads the clones in `migration-scripts/.sources/` and
 * writes `migration-scripts/inventory.json`. Same input gives the same file.
 * Stops with an error if a page cannot be parsed.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative } from 'node:path';
import { loadBindings, parse as parseTsx } from 'next/dist/build/swc/index.js';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { parse as parseYaml } from 'yaml';

const sourcesDir = join(import.meta.dirname, '.sources');
const outputFile = join(import.meta.dirname, 'inventory.json');

const versions = [
  { name: 'latest', folder: 'tiptap-docs-main' },
  { name: 'v2', folder: 'tiptap-docs-v2' },
];
const cloneFolders = ['tiptap-docs-main', 'tiptap-docs-v2', 'tiptap-main'];

const maxExampleValues = 3;
const maxExamplePages = 5;

const moduleExtensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs'];
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif'];
const dataExtensions = ['.json', '.yaml', '.yml'];

// Minimal shapes of the mdast, MDX and estree nodes this script reads.
type Position = { start: { offset: number }; end: { offset: number } };
type MdNode = {
  type: string;
  name?: string | null;
  value?: unknown;
  position?: Position;
  children?: MdNode[];
  attributes?: MdNode[];
  data?: { estree?: EsNode };
};
type EsNode = { type: string; start: number; end: number; [key: string]: unknown };

/** Collects distinct values and pages for one inventory entry. */
class Usage {
  pages = new Set<string>();
  values = new Set<string>();

  add(page: string, value?: string) {
    this.pages.add(page);
    if (value !== undefined) this.values.add(value);
  }

  summary() {
    const pages = [...this.pages].sort();
    return {
      pageCount: pages.length,
      examplePages: pages.slice(0, maxExamplePages),
    };
  }

  exampleValues() {
    return [...this.values].sort().slice(0, maxExampleValues);
  }
}

type TagEntry = {
  usage: Usage;
  sources: Set<string>;
  importPaths: Set<string>;
  props: Map<string, Usage>;
  hasChildren: boolean;
};

type ImportEntry = {
  usage: Usage;
  kind: string;
  location: string;
  file: string | null;
};

const byName = <T>(map: Map<string, T>) =>
  [...map.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

const walkFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walkFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );

const isFile = (path: string) => existsSync(path) && statSync(path).isFile();

/** Returns the names of the capitalized components `useMDXComponents` returns. */
const readGlobalComponents = async (file: string) => {
  const program: EsNode = await parseTsx(readFileSync(file, 'utf8'), {
    isModule: true,
    filename: file,
    jsc: { parser: { syntax: 'typescript', tsx: true } },
  });
  const names = new Set<string>();
  const visit = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const value = node as EsNode;
    if (
      value.type === 'FunctionDeclaration' &&
      (value.identifier as EsNode).value === 'useMDXComponents'
    ) {
      for (const statement of (value.body as { stmts: EsNode[] }).stmts) {
        const argument = statement.argument as EsNode | undefined;
        if (statement.type !== 'ReturnStatement' || argument?.type !== 'ObjectExpression') continue;
        for (const property of argument.properties as EsNode[]) {
          const key =
            property.type === 'Identifier' ? property : (property.key as EsNode | undefined);
          const name = key?.type === 'Identifier' ? (key.value as string) : null;
          if (name && /^[A-Z]/.test(name)) names.add(name);
        }
      }
    }
    Object.values(value).forEach(visit);
  };
  visit(program);
  return names;
};

const parser = remark().use(remarkFrontmatter).use(remarkGfm).use(remarkMdx);

const inventoryVersion = async (folder: string) => {
  const repoDir = join(sourcesDir, folder);
  const srcDir = join(repoDir, 'src');
  const contentDir = join(srcDir, 'content');
  const globals = await readGlobalComponents(join(srcDir, 'mdx-components.tsx'));

  const pageFiles = walkFiles(contentDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => relative(contentDir, file).split('\\').join('/'))
    .sort();

  const components = new Map<string, TagEntry>();
  const htmlTags = new Map<string, TagEntry>();
  const frontmatter = new Map<string, Usage>();
  const imports = new Map<string, ImportEntry>();
  const exportsList = new Map<string, Usage>();
  const expressions = new Map<string, Usage>();

  /** Resolves a local import to a file in the clone. Returns `null` for packages. */
  const resolveImport = (page: string, specifier: string) => {
    const clean = specifier.split('?')[0];
    let base: string;
    if (clean.startsWith('@/')) base = clean.slice(2);
    else if (clean.startsWith('.')) base = posix.join('content', posix.dirname(page), clean);
    else return null;
    const candidates = [
      base,
      ...[...moduleExtensions, '.mdx', ...dataExtensions].map((ext) => base + ext),
      ...moduleExtensions.map((ext) => `${base}/index${ext}`),
    ];
    const file = candidates.find((candidate) => isFile(join(srcDir, candidate)));
    if (!file)
      throw new Error(`${folder}/src/content/${page}: cannot resolve import "${specifier}"`);
    return { alias: `@/${base}`, file: `src/${file}` };
  };

  const importKind = (file: string | null, bindings: string[]) => {
    if (!file) return 'package';
    const ext = posix.extname(file).toLowerCase();
    if (ext === '.mdx') return 'mdx-file';
    if (imageExtensions.includes(ext)) return 'image';
    if (dataExtensions.includes(ext)) return 'data';
    if (moduleExtensions.includes(ext)) {
      return bindings.some((binding) => /^[A-Z]/.test(binding)) ? 'component' : 'data';
    }
    return 'file';
  };

  const tagEntry = (map: Map<string, TagEntry>, name: string) => {
    let entry = map.get(name);
    if (!entry) {
      entry = {
        usage: new Usage(),
        sources: new Set(),
        importPaths: new Set(),
        props: new Map(),
        hasChildren: false,
      };
      map.set(name, entry);
    }
    return entry;
  };

  const usage = (map: Map<string, Usage>, key: string) => {
    let entry = map.get(key);
    if (!entry) {
      entry = new Usage();
      map.set(key, entry);
    }
    return entry;
  };

  for (const page of pageFiles) {
    const source = readFileSync(join(contentDir, page), 'utf8');
    let tree: MdNode;
    try {
      tree = parser.parse(source) as MdNode;
    } catch (error) {
      throw new Error(
        `${folder}/src/content/${page}: cannot parse MDX: ${(error as Error).message}`,
      );
    }

    const text = (start: number, end: number) => source.slice(start, end);

    // Imported bindings of this page, mapped to their import path and kind.
    const bindings = new Map<string, { path: string; kind: string }>();
    const tags: { name: string; props: [string, string][]; hasChildren: boolean }[] = [];

    /** Collects JSX elements inside an estree program, for example `{cond && <Foo />}`. */
    const visitEstree = (node: unknown) => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach(visitEstree);
        return;
      }
      const value = node as EsNode;
      if (value.type === 'JSXElement') {
        const opening = value.openingElement as EsNode;
        const props = (opening.attributes as EsNode[]).map((attribute): [string, string] => {
          if (attribute.type === 'JSXSpreadAttribute') {
            return ['...', text(attribute.start, attribute.end)];
          }
          const attributeValue = attribute.value as EsNode | null;
          return [
            jsxName(attribute.name as EsNode),
            attributeValue ? text(attributeValue.start, attributeValue.end) : '',
          ];
        });
        tags.push({
          name: jsxName(opening.name as EsNode),
          props,
          hasChildren: (value.children as EsNode[]).some(
            (child) => child.type !== 'JSXText' || String(child.value).trim() !== '',
          ),
        });
      }
      for (const [key, child] of Object.entries(value)) {
        if (key !== 'loc' && key !== 'range') visitEstree(child);
      }
    };

    const visit = (node: MdNode) => {
      switch (node.type) {
        case 'code':
        case 'inlineCode':
          return;
        case 'yaml': {
          const data = parseYaml(String(node.value)) ?? {};
          for (const [field, value] of Object.entries(data)) {
            usage(frontmatter, field).add(page, JSON.stringify(value));
          }
          return;
        }
        case 'mdxjsEsm': {
          for (const statement of (node.data?.estree?.body ?? []) as EsNode[]) {
            if (statement.type === 'ImportDeclaration') {
              const specifier = (statement.source as EsNode).value as string;
              const names = (statement.specifiers as EsNode[]).map(
                (item) => (item.local as EsNode).name as string,
              );
              const resolved = resolveImport(page, specifier);
              const path = resolved?.alias ?? specifier;
              const file = resolved?.file ?? null;
              const kind = importKind(file, names);
              let entry = imports.get(path);
              if (!entry) {
                entry = {
                  usage: new Usage(),
                  kind,
                  location: !file ? 'package' : file.startsWith('src/content/') ? 'content' : 'app',
                  file,
                };
                imports.set(path, entry);
              }
              entry.usage.add(page);
              for (const name of names) bindings.set(name, { path, kind });
            } else {
              usage(exportsList, text(statement.start, statement.end)).add(page);
              visitEstree(statement);
            }
          }
          return;
        }
        case 'mdxFlowExpression':
        case 'mdxTextExpression': {
          const { start, end } = node.position as Position;
          usage(expressions, text(start.offset, end.offset)).add(page);
          visitEstree(node.data?.estree);
          return;
        }
        case 'mdxJsxFlowElement':
        case 'mdxJsxTextElement': {
          const props = (node.attributes ?? []).map((attribute): [string, string] => {
            const { start, end } = attribute.position as Position;
            const raw = text(start.offset, end.offset);
            if (attribute.type === 'mdxJsxExpressionAttribute') return ['...', raw];
            visitEstree((attribute.value as MdNode | null)?.data?.estree);
            const name = attribute.name as string;
            return [name, attribute.value === null ? '' : raw.slice(raw.indexOf('=') + 1).trim()];
          });
          // `<>…</>` fragments have no name and are not listed.
          if (node.name) {
            tags.push({
              name: node.name,
              props,
              hasChildren: (node.children ?? []).some(
                (child) => child.type !== 'text' || String(child.value).trim() !== '',
              ),
            });
          }
          break;
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);

    for (const tag of tags) {
      const isComponent = /^[A-Z]/.test(tag.name);
      const entry = tagEntry(isComponent ? components : htmlTags, tag.name);
      entry.usage.add(page);
      if (tag.hasChildren) entry.hasChildren = true;
      for (const [prop, value] of tag.props) {
        let propUsage = entry.props.get(prop);
        if (!propUsage) {
          propUsage = new Usage();
          entry.props.set(prop, propUsage);
        }
        propUsage.add(page, value);
      }
      if (!isComponent) continue;
      const binding = bindings.get(tag.name.split('.')[0]);
      if (binding) {
        entry.sources.add(binding.kind === 'mdx-file' ? 'mdx-file' : 'import');
        entry.importPaths.add(binding.path);
      } else if (globals.has(tag.name.split('.')[0])) {
        entry.sources.add('global');
      } else {
        entry.sources.add('unknown');
      }
    }
  }

  const tagList = (map: Map<string, TagEntry>, withSource: boolean) =>
    byName(map).map(([name, entry]) => ({
      name,
      ...(withSource
        ? { sources: [...entry.sources].sort(), importPaths: [...entry.importPaths].sort() }
        : {}),
      props: byName(entry.props).map(([prop, propUsage]) => ({
        name: prop,
        exampleValues: propUsage.exampleValues(),
      })),
      hasChildren: entry.hasChildren,
      ...entry.usage.summary(),
    }));

  const importGroups: Record<string, unknown[]> = {};
  for (const [path, entry] of byName(imports)) {
    importGroups[entry.kind] ??= [];
    importGroups[entry.kind].push({
      path,
      file: entry.file,
      location: entry.location,
      ...entry.usage.summary(),
    });
  }

  return {
    pageCount: pageFiles.length,
    components: tagList(components, true),
    htmlTags: tagList(htmlTags, false),
    frontmatterFields: byName(frontmatter).map(([name, fieldUsage]) => ({
      name,
      ...fieldUsage.summary(),
      exampleValues: fieldUsage.exampleValues(),
    })),
    imports: Object.fromEntries(Object.entries(importGroups).sort(([a], [b]) => (a < b ? -1 : 1))),
    exports: byName(exportsList).map(([source, exportUsage]) => ({
      source,
      ...exportUsage.summary(),
    })),
    expressions: byName(expressions).map(([source, expressionUsage]) => ({
      source,
      ...expressionUsage.summary(),
    })),
  };
};

/** Returns the source text of a JSX element name, for example `Tabs.Item`. */
function jsxName(node: EsNode): string {
  if (node.type === 'JSXIdentifier') return node.name as string;
  if (node.type === 'JSXMemberExpression') {
    return `${jsxName(node.object as EsNode)}.${jsxName(node.property as EsNode)}`;
  }
  return `${jsxName(node.namespace as EsNode)}:${jsxName(node.name as EsNode)}`;
}

await loadBindings();

const commits = Object.fromEntries(
  cloneFolders.map((folder) => [
    folder,
    execFileSync('git', ['-C', join(sourcesDir, folder), 'rev-parse', 'HEAD'], {
      encoding: 'utf8',
    }).trim(),
  ]),
);

const inventory: Record<string, unknown> = { commits };
for (const version of versions) {
  const result = await inventoryVersion(version.folder);
  inventory[version.name] = result;
  console.log(`${version.name}: ${result.pageCount} pages`);
}

writeFileSync(outputFile, `${JSON.stringify(inventory, null, 2)}\n`);
// Formats with the project formatter, so the file passes `pnpm lint`.
execFileSync(
  join(import.meta.dirname, '../node_modules/.bin/biome'),
  ['format', '--write', outputFile],
  { stdio: 'ignore' },
);
console.log(`Wrote ${relative(dirname(import.meta.dirname), outputFile)}`);
