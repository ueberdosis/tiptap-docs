/**
 * Copies the MDX pages of both source versions into `content/docs/` (latest) and `content/v2/` (v2),
 * and the images the pages import into `src/assets/`. Replaces these folders only after all pages
 * pass the checks.
 * Removes imports that point into the old app, and exports that use them. Imports brand icons
 * (for example `Twitch`) from `@/components/brand-icons` instead of `lucide-react`. Keeps everything
 * else unchanged.
 * Copies the known shared fragments in `_shared/` folders too. Replaces a fragment tag on a page
 * with `<include>` of the fragment file and removes its import.
 * Stops with an error on an unknown import, an unknown frontmatter field, an unknown fragment or
 * fragment tag shape, or a page it cannot parse.
 * Renames the frontmatter `component.icon` values listed in `iconRenames`. Stops with an error when
 * a listed name is not used by any page.
 * Removes the top-level frontmatter field `icon`. The old app does not use it.
 * Replaces the frontmatter `sidebars: { hideSecondary: true }` with Fumadocs' `full: true`. Stops
 * with an error on any other key or value under `sidebars`.
 * Moves the frontmatter field `headerDemo` into the page body as a `HeaderDemo` (`steps/header-demo.ts`).
 * Moves the frontmatter field `intro` above it as a Markdown paragraph (`steps/intro.ts`).
 * Adds the `deprecated` tag to every latest page in `ai/deprecated/` (`steps/deprecated-tags.ts`).
 * With `--strict`, also stops on a component without an entry in `component-mapping.ts`.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, posix, relative } from 'node:path';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { isMap, isScalar, parseDocument, parse as parseYaml } from 'yaml';
import { brandIconsModule, isBrandIcon } from '../src/lib/brand-icons.ts';
import { docsPageSchema } from '../src/lib/page-schema.ts';
import { componentMapping, iconRenames } from './component-mapping.ts';
import { currentColorIconImport, currentColorIcons } from './steps/cards.ts';
import { deprecatedTagEdit } from './steps/deprecated-tags.ts';
import { headerDemoEdits } from './steps/header-demo.ts';
import { introEdits } from './steps/intro.ts';

const strict = process.argv.includes('--strict');

const sourcesDir = join(import.meta.dirname, '.sources');
const appDir = dirname(import.meta.dirname);
const assetsDir = join(appDir, 'src/assets');

const versions = [
  { name: 'latest', folder: 'tiptap-docs-main', output: 'content/docs' },
  { name: 'v2', folder: 'tiptap-docs-v2', output: 'content/v2' },
];

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif'];
const packages = new Set(
  Object.keys(JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8')).dependencies),
);
const schemaFields = new Set(Object.keys(docsPageSchema.shape));

/** Shared fragments: tag and import name → file path inside `src/content/`. */
const fragments: Record<string, string> = {
  RegionalEndpoints: 'conversion/_shared/_regional-endpoints.mdx',
  CustomNodeConversionGuide: 'conversion/export/_shared/_custom-node-conversion-guide.mdx',
  ElementOverridesRestApi: 'conversion/export/_shared/_element-overrides-rest-api.mdx',
  ExportStylesGuide: 'conversion/export/_shared/_export-styles-guide.mdx',
};
const fragmentFiles = new Set(Object.values(fragments));

// Minimal shapes of the mdast, MDX and estree nodes this script reads.
type MdNode = {
  type: string;
  name?: string | null;
  value?: unknown;
  children?: MdNode[];
  attributes?: MdNode[];
  data?: { estree?: EsNode };
  position?: { start: { offset: number }; end: { offset: number } };
};
type EsNode = { type: string; start: number; end: number; [key: string]: unknown };

const parser = remark().use(remarkFrontmatter).use(remarkGfm).use(remarkMdx);

/** Old names from `iconRenames` that a page used. */
const renamedIcons = new Set<string>();

/**
 * Returns the edit that renames `component.icon` in the frontmatter `yaml`, which starts at `offset`
 * in the page, or null when its value is not in `iconRenames`.
 */
const iconRenameEdit = (
  label: string,
  yaml: string,
  offset: number,
): [number, number, string] | null => {
  const component = parseDocument(yaml).get('component', true);
  const icon = isMap(component) ? component.get('icon', true) : null;
  if (
    !isScalar(icon) ||
    typeof icon.value !== 'string' ||
    !Object.hasOwn(iconRenames, icon.value)
  ) {
    return null;
  }
  if (icon.type !== 'PLAIN' || !icon.range)
    throw new Error(`${label}: component.icon "${icon.value}" is not a plain value`);
  renamedIcons.add(icon.value);
  return [offset + icon.range[0], offset + icon.range[1], iconRenames[icon.value]];
};

/**
 * Returns the edit that removes the top-level `icon` field from the frontmatter `yaml`, which starts
 * at `offset` in the page, or null when there is none.
 */
const pageIconEdit = (label: string, yaml: string, offset: number): [number, number] | null => {
  const contents = parseDocument(yaml).contents;
  const pair = isMap(contents)
    ? contents.items.find((item) => isScalar(item.key) && item.key.value === 'icon')
    : undefined;
  if (!pair) return null;
  if (!isScalar(pair.key) || !isScalar(pair.value) || !pair.key.range || !pair.value.range) {
    throw new Error(`${label}: frontmatter icon is not a plain value`);
  }
  return [offset + pair.key.range[0], offset + pair.value.range[1]];
};

/**
 * Returns the edit that replaces `sidebars: { hideSecondary: true }` in the frontmatter `yaml`, which
 * starts at `offset` in the page, with Fumadocs' `full: true`, or null when there is no `sidebars`.
 * Throws on any other key or value under `sidebars`.
 */
const fullPageEdit = (
  label: string,
  yaml: string,
  offset: number,
): [number, number, string] | null => {
  const contents = parseDocument(yaml).contents;
  const pair = isMap(contents)
    ? contents.items.find((item) => isScalar(item.key) && item.key.value === 'sidebars')
    : undefined;
  if (!pair) return null;
  const value = pair.value;
  if (!isScalar(pair.key) || !pair.key.range || !isMap(value) || !value.range) {
    throw new Error(`${label}: frontmatter sidebars is not a map`);
  }
  for (const [key, field] of Object.entries(value.toJSON() as Record<string, unknown>)) {
    if (key !== 'hideSecondary') {
      throw new Error(`${label}: unknown frontmatter key "sidebars.${key}"`);
    }
    if (field !== true) {
      throw new Error(`${label}: frontmatter sidebars.hideSecondary is not true`);
    }
  }
  // A block map's range ends after its line break, except as the last field of the frontmatter.
  const end = value.range[1];
  const lineBreak = yaml[end - 1] === '\n' ? '\n' : '';
  return [offset + pair.key.range[0], offset + end, `full: true${lineBreak}`];
};

const walkFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walkFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );

/** Returns the source text of a JSX element name, for example `Tabs.Item`. */
const jsxName = (node: EsNode): string => {
  if (node.type === 'JSXIdentifier') return node.name as string;
  if (node.type === 'JSXMemberExpression') {
    return `${jsxName(node.object as EsNode)}.${jsxName(node.property as EsNode)}`;
  }
  return `${jsxName(node.namespace as EsNode)}:${jsxName(node.name as EsNode)}`;
};

/** Returns the package name of a bare import, for example `@scope/name` or `name`. */
const packageName = (specifier: string) =>
  specifier
    .split('/')
    .slice(0, specifier.startsWith('@') ? 2 : 1)
    .join('/');

/** Returns the image path without the `?url` query, for example `@/assets/x.svg?url`. */
const imagePath = (specifier: string) => specifier.replace(/\?url$/, '');

/** What to do with one import of `page` (path inside `src/content/`). Throws on an unknown import. */
const importAction = (label: string, page: string, specifier: string) => {
  if (specifier.includes('/_shared/')) {
    const path = posix.join('content', posix.dirname(page), specifier);
    if (specifier.startsWith('.') && fragmentFiles.has(path.slice('content/'.length))) {
      return 'fragment';
    }
    throw new Error(`${label}: unknown shared fragment import "${specifier}"`);
  }
  if (specifier.startsWith('.')) {
    const path = posix.join('content', posix.dirname(page), specifier);
    if (path.startsWith('content/') && path.endsWith('.mdx')) return 'remove';
  } else if (specifier.startsWith('@/assets/icons/')) {
    const name = specifier.slice('@/assets/icons/'.length, -'.svg'.length);
    if (specifier.endsWith('.svg') && currentColorIcons.includes(name)) return 'icon';
  } else if (specifier.startsWith('@/assets/')) {
    const path = imagePath(specifier);
    if (imageExtensions.includes(posix.extname(path).toLowerCase())) return 'image';
  } else if (specifier.startsWith('@/content/')) {
    if (specifier.endsWith('.mdx')) return 'remove';
  } else if (specifier.startsWith('@/')) {
    return 'remove';
  } else if (!specifier.startsWith('/')) {
    if (packages.has(packageName(specifier))) return 'package';
  }
  throw new Error(`${label}: unknown import "${specifier}"`);
};

/** Returns the names of all identifiers in an estree node, including JSX names. */
const identifiers = (node: unknown, names = new Set<string>()) => {
  if (!node || typeof node !== 'object') return names;
  if (Array.isArray(node)) {
    for (const child of node) identifiers(child, names);
    return names;
  }
  const value = node as EsNode;
  if (value.type === 'Identifier' || value.type === 'JSXIdentifier')
    names.add(value.name as string);
  for (const [key, child] of Object.entries(value)) {
    if (key !== 'loc' && key !== 'range') identifiers(child, names);
  }
  return names;
};

/**
 * Replaces the given ranges with their text. Ranges must not overlap. A removed range that fills its
 * lines removes the whole lines.
 */
const editRanges = (source: string, edits: [number, number, string?][]) => {
  let output = source;
  for (const [start, end, text = ''] of [...edits].sort((a, b) => b[0] - a[0])) {
    const lineStart = output.lastIndexOf('\n', start - 1) + 1;
    const newline = output.indexOf('\n', end);
    const lineEnd = newline === -1 ? output.length : newline + 1;
    const fillsLines =
      output.slice(lineStart, start).trim() === '' && output.slice(end, lineEnd).trim() === '';
    output =
      !text && fillsLines
        ? output.slice(0, lineStart) + output.slice(lineEnd)
        : output.slice(0, start) + text + output.slice(end);
  }
  return output;
};

/** Checks the pages of one version and adds their output to `outputs`. */
const copyVersion = (version: (typeof versions)[number]) => {
  const srcDir = join(sourcesDir, version.folder, 'src');
  const contentDir = join(srcDir, 'content');
  const outputDir = join(appDir, version.output);

  const pages = walkFiles(contentDir)
    .map((file) => relative(contentDir, file).split('\\').join('/'))
    .filter((page) => page.endsWith('.mdx'))
    .sort();
  for (const page of pages) {
    if (page.split('/').includes('_shared') && !fragmentFiles.has(page)) {
      throw new Error(`${version.folder}/src/content/${page}: unknown shared fragment`);
    }
  }
  /** Image path inside `src/` → path of the source file inside `src/`. */
  const images = new Map<string, string>();

  for (const page of pages) {
    const label = `${version.folder}/src/content/${page}`;
    const source = readFileSync(join(contentDir, page), 'utf8');
    let tree: MdNode;
    try {
      tree = parser.parse(source) as MdNode;
    } catch (error) {
      throw new Error(`${label}: cannot parse MDX: ${(error as Error).message}`);
    }

    const edits: [number, number, string?][] = [];
    const removedBindings = new Set<string>();
    const exportStatements: EsNode[] = [];
    const packageBindings = new Set<string>();
    /** Fragment name → import specifier. */
    const fragmentImports = new Map<string, string>();
    const components: string[] = [];
    const elements: MdNode[] = [];
    const expressionComponents = new Set<string>();

    /** Collects JSX element names inside an estree program, for example `{cond && <Foo />}`. */
    const visitEstree = (node: unknown) => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach(visitEstree);
        return;
      }
      const value = node as EsNode;
      if (value.type === 'JSXOpeningElement') {
        const name = jsxName(value.name as EsNode);
        components.push(name);
        expressionComponents.add(name);
      }
      for (const [key, child] of Object.entries(value)) {
        if (key !== 'loc' && key !== 'range') visitEstree(child);
      }
    };

    const visit = (node: MdNode) => {
      switch (node.type) {
        case 'yaml': {
          const yaml = String(node.value);
          const yamlOffset = source.indexOf(yaml, node.position?.start.offset);
          const frontmatterEnd = node.position?.end.offset as number;
          const bodyStart = source[frontmatterEnd] === '\n' ? frontmatterEnd + 1 : frontmatterEnd;
          edits.push(...headerDemoEdits(label, yaml, yamlOffset, bodyStart));
          // Inserts at the same offset come out in reverse order, so the intro lands above the demo.
          edits.push(...introEdits(label, yaml, yamlOffset, bodyStart));
          const { headerDemo: _, intro: __, ...data } = parseYaml(yaml) ?? {};
          for (const field of Object.keys(data)) {
            if (!schemaFields.has(field)) {
              throw new Error(`${label}: unknown frontmatter field "${field}"`);
            }
          }
          const result = docsPageSchema.safeParse(data);
          if (!result.success) {
            throw new Error(`${label}: invalid frontmatter: ${result.error.message}`);
          }
          const rename = iconRenameEdit(label, yaml, yamlOffset);
          if (rename) edits.push(rename);
          const pageIcon = pageIconEdit(label, yaml, yamlOffset);
          if (pageIcon) edits.push(pageIcon);
          const fullPage = fullPageEdit(label, yaml, yamlOffset);
          if (fullPage) edits.push(fullPage);
          if (version.name === 'latest') {
            const deprecatedTag = deprecatedTagEdit(label, page, yaml, yamlOffset);
            if (deprecatedTag) edits.push(deprecatedTag);
          }
          return;
        }
        case 'mdxjsEsm': {
          for (const statement of (node.data?.estree?.body ?? []) as EsNode[]) {
            if (statement.type !== 'ImportDeclaration') {
              exportStatements.push(statement);
              continue;
            }
            const specifier = (statement.source as EsNode).value as string;
            const action = importAction(label, page, specifier);
            if (action === 'fragment') {
              const [item, ...rest] = statement.specifiers as EsNode[];
              const name = (item?.local as EsNode | undefined)?.name as string;
              const path = posix.join(posix.dirname(page), specifier);
              if (
                rest.length ||
                item.type !== 'ImportDefaultSpecifier' ||
                fragments[name] !== path
              ) {
                throw new Error(`${label}: unknown shared fragment import "${specifier}"`);
              }
              fragmentImports.set(name, specifier);
              edits.push([statement.start, statement.end]);
            }
            if (action === 'remove') {
              edits.push([statement.start, statement.end]);
              for (const item of statement.specifiers as EsNode[]) {
                removedBindings.add((item.local as EsNode).name as string);
              }
            }
            if (action === 'image') {
              const image = imagePath(specifier).slice(2);
              images.set(image, image);
            }
            if (action === 'icon') {
              // The same SVG file as an `img` URL, at the path the latest pages import it from.
              const target = currentColorIconImport(posix.basename(specifier, '.svg'));
              const literal = statement.source as EsNode;
              edits.push([literal.start, literal.end, `'${target}'`]);
              images.set(imagePath(target).slice(2), specifier.slice(2));
            }
            if (action === 'package') {
              const items = statement.specifiers as EsNode[];
              const imported = items.map((item) => (item.imported as EsNode | undefined)?.name);
              if (specifier === 'lucide-react' && imported.some((name) => isBrandIcon(`${name}`))) {
                const plain = items.every(
                  (item) =>
                    item.type === 'ImportSpecifier' &&
                    (item.local as EsNode).name === (item.imported as EsNode).name,
                );
                if (!plain || !imported.every((name) => isBrandIcon(`${name}`))) {
                  throw new Error(
                    `${label}: brand icons from "lucide-react" must be imported alone and without "as"`,
                  );
                }
                const literal = statement.source as EsNode;
                edits.push([literal.start, literal.end, `'${brandIconsModule}'`]);
              }
              for (const item of items) {
                packageBindings.add((item.local as EsNode).name as string);
              }
            }
          }
          return;
        }
        case 'mdxFlowExpression':
        case 'mdxTextExpression':
          visitEstree(node.data?.estree);
          return;
        case 'mdxJsxFlowElement':
        case 'mdxJsxTextElement':
          if (node.name) elements.push(node);
          for (const attribute of node.attributes ?? []) {
            visitEstree(attribute.data?.estree);
            visitEstree((attribute.value as MdNode | null)?.data?.estree);
          }
          break;
      }
      node.children?.forEach(visit);
    };
    visit(tree);

    // A fragment tag becomes `<include>` of the fragment file. It must be self-closing, with no props.
    for (const name of expressionComponents) {
      if (fragmentImports.has(name)) {
        throw new Error(`${label}: shared fragment <${name}> inside an expression`);
      }
    }
    for (const node of elements) {
      const name = node.name as string;
      const specifier = fragmentImports.get(name);
      if (!specifier) {
        components.push(name);
        continue;
      }
      const start = node.position?.start.offset as number;
      const end = node.position?.end.offset as number;
      if (
        node.attributes?.length ||
        node.children?.length ||
        !source.slice(start, end).endsWith('/>')
      ) {
        throw new Error(`${label}: shared fragment <${name}> must be self-closing, with no props`);
      }
      edits.push([start, end, `<include>${specifier}</include>`]);
    }

    // An export that uses a removed import cannot run, so it is removed too, and the components it
    // uses are not counted.
    for (const statement of exportStatements) {
      const names = identifiers(statement);
      const fragment = [...fragmentImports.keys()].find((name) => names.has(name));
      if (fragment) throw new Error(`${label}: shared fragment "${fragment}" used in an export`);
      if ([...removedBindings].some((name) => names.has(name))) {
        edits.push([statement.start, statement.end]);
      } else {
        visitEstree(statement);
      }
    }

    if (strict) {
      const unmapped = components.find(
        (name) =>
          /^[A-Z]/.test(name) &&
          !(name in componentMapping) &&
          !packageBindings.has(name.split('.')[0]),
      );
      if (unmapped) throw new Error(`${label}: component without a mapping "${unmapped}"`);
    }

    outputs.set(join(outputDir, page), editRanges(source, edits));
  }

  const fragmentCount = pages.filter((page) => fragmentFiles.has(page)).length;
  return {
    pages: pages.length - fragmentCount,
    fragments: fragmentCount,
    images: [...images].sort(([a], [b]) => (a < b ? -1 : 1)),
    srcDir,
  };
};

// Checks all pages and images first, so a failed run leaves the old output as it is.
const outputs = new Map<string, string>();
const copiedImages = new Map<string, string>();
const counts: string[] = [];
for (const version of versions) {
  const result = copyVersion(version);
  for (const [image, file] of result.images) {
    const from = join(result.srcDir, file);
    if (!existsSync(from)) throw new Error(`${version.folder}: imported image "${file}" not found`);
    const previous = copiedImages.get(image);
    if (previous && !readFileSync(previous).equals(readFileSync(from))) {
      throw new Error(`${image}: latest and v2 have different files with the same path`);
    }
    copiedImages.set(image, previous ?? from);
  }
  counts.push(
    `${version.name}: ${result.pages} pages, ${result.fragments} fragments, ${result.images.length} images`,
  );
}

const unusedRenames = Object.keys(iconRenames).filter((name) => !renamedIcons.has(name));
if (unusedRenames.length) {
  throw new Error(
    `iconRenames: no page has component.icon ${unusedRenames.map((name) => `"${name}"`).join(', ')}`,
  );
}

for (const version of versions)
  rmSync(join(appDir, version.output), { recursive: true, force: true });
rmSync(assetsDir, { recursive: true, force: true });
for (const [target, content] of outputs) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}
for (const [image, from] of copiedImages) cpSync(from, join(appDir, 'src', image));

console.log(counts.join('\n'));
console.log(`Copied ${copiedImages.size} images to src/assets/`);
