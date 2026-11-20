import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { embedSource } from 'fumadocs-core/mdx-plugins/stringifier';
import * as lucide from 'lucide-react';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { parse as parseYaml } from 'yaml';
import { brandIconsModule, isBrandIcon } from './brand-icons';
import featureCatalog from './feature-catalog.json';
import { docsRoute } from './shared';

type Node = {
  type: string;
  name?: string | null;
  value?: unknown;
  children?: Node[];
  attributes?: { type: string; name?: string; value?: unknown }[];
  position?: unknown;
  [key: string]: unknown;
};

type File = {
  path?: string;
  data: { _compiler?: { addDependency: (file: string) => void } } & Record<string, unknown>;
};

export type RemarkCatalogsOptions = {
  /** Content folder of the collection, for example `content/docs`. */
  dir: string;
  /** URL of the collection root, for example `/docs`. */
  baseUrl: string;
};

type Entry = {
  name: string;
  description: string;
  icon: string;
  href: string;
  tags: string[];
  isNew: boolean;
};

/** One page in a catalog folder. */
type Page = {
  /** File path for error messages. */
  label: string;
  /** Page URL in the collection. */
  href: string;
  /** Parsed frontmatter. */
  data: ReturnType<typeof parseYaml>;
};

/** What a catalog's `build` gets besides the props. */
type BuildContext = {
  options: RemarkCatalogsOptions;
  addDependency: (file: string) => void;
  fail: (message: string) => never;
};

/** A catalog tag and the code that turns it into MDX. */
type Catalog = {
  /** JSX tag the plugin replaces, for example `Extensions`. */
  tag: string;
  /** Names of the string props the tag must have. It may have no other props. */
  props: string[];
  /** Writes the MDX for the list and the icon names it uses. Calls `fail` on bad data. */
  build: (props: Record<string, string>, context: BuildContext) => { mdx: string; icons: string[] };
};

/** A catalog of the pages in the folder of its `path` prop. */
const pathCatalog = (
  tag: string,
  build: (pages: Page[], fail: (message: string) => never) => { mdx: string; icons: string[] },
): Catalog => ({
  tag,
  props: ['path'],
  build: ({ path }, { options, addDependency, fail }) => {
    const folder = join(options.dir, path);
    if (!existsSync(folder) || !statSync(folder).isDirectory()) {
      fail(`has a path that does not exist: "${path}"`);
    }
    return build(readPages(folder, options, addDependency), fail);
  },
});

/** A catalog of icon cards in sections, read from one frontmatter block per page. */
type CardCatalog = {
  /** JSX tag the plugin replaces, for example `Extensions`. */
  tag: string;
  /** Frontmatter key that holds `name`, `description`, `type` and `icon`. */
  key: string;
  /** Sections in output order, by the frontmatter `type`. */
  sections: { type: string; heading: string }[];
  /** Filter buttons in output order. `has` says whether a card with these tags is in it. */
  filters: { value: string; label: string; has: (tags: string[]) => boolean }[];
  /** Text shown when no card matches. */
  empty: string;
  /** Reads the card tags and the "New" label. `block` is the frontmatter under `key`. */
  read: (
    block: Record<string, unknown>,
    page: Record<string, unknown>,
    fail: (message: string) => never,
  ) => { tags: string[]; isNew: boolean };
};

/** Page `tags` types shown as extension card tags, in this order. */
const extensionPlanTags = [
  { type: 'start', label: 'Start' },
  { type: 'team', label: 'Team' },
  { type: 'addon', label: 'Addon' },
];

const extensions: CardCatalog = {
  tag: 'Extensions',
  key: 'extension',
  sections: [
    { type: 'node', heading: 'Nodes' },
    { type: 'mark', heading: 'Marks' },
    { type: 'extension', heading: 'Functionality' },
  ],
  filters: [
    { value: 'opensource', label: 'Open Source', has: (tags) => tags.length === 0 },
    { value: 'start', label: 'Start Plan', has: (tags) => tags.includes('Start') },
    {
      value: 'team',
      label: 'Team Plan',
      has: (tags) => tags.includes('Team') || tags.includes('Start'),
    },
    { value: 'addon', label: 'Add-on', has: (tags) => tags.includes('Addon') },
  ],
  empty: 'No extensions found.',
  read: (_block, page) => {
    const pageTags = ((page.tags ?? []) as { type?: string }[]).map((tag) => tag?.type);
    return {
      tags: extensionPlanTags
        .filter(({ type }) => pageTags.includes(type))
        .map(({ label }) => label),
      isNew: pageTags.includes('beta'),
    };
  },
};

const uiComponents: CardCatalog = {
  tag: 'UIComponents',
  key: 'component',
  sections: [
    { type: 'component', heading: 'Components' },
    { type: 'utils-component', heading: 'Utils Components' },
    { type: 'node-component', heading: 'Node Components' },
    { type: 'primitive', heading: 'Primitives' },
  ],
  filters: [
    { value: 'opensource', label: 'Open Source', has: (tags) => tags.includes('Open Source') },
  ],
  empty: 'No components found.',
  read: (block, _page, fail) => {
    const flag = (name: string) => {
      const value = block[name] ?? false;
      if (typeof value !== 'boolean') fail(`has a component.${name} that is not a boolean`);
      return value as boolean;
    };
    return { tags: flag('isOpen') ? ['Open Source'] : [], isNew: flag('isNew') };
  },
};

const isLucideIcon = (name: string) =>
  Object.hasOwn(lucide, name) && /^[A-Z]\w*$/.test(name) && !name.startsWith('Lucide');

/** True for a brand icon or a lucide-react icon. Brand names win over lucide names. */
const isIcon = (name: string) => isBrandIcon(name) || isLucideIcon(name);

/** Escapes text for use as Markdown paragraph content inside JSX. */
const escapeText = (text: string) => text.replace(/[\\`*_{}[\]<>#|~]/g, (char) => `\\${char}`);

const listMdx = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.mdx'))
    .sort();

/**
 * Reads the frontmatter of every page under `folder`, except `index.mdx` and `overview.mdx`, and
 * registers each file as a dependency.
 */
function readPages(
  folder: string,
  options: RemarkCatalogsOptions,
  addDependency: (file: string) => void,
): Page[] {
  return listMdx(folder)
    .filter((file) => !/(^|\/)(index|overview)\.mdx$/.test(file))
    .map((file) => {
      const fullPath = join(folder, file);
      addDependency(fullPath);
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(fullPath, 'utf8'))?.[1];
      const pagePath = relative(options.dir, fullPath).replace(/\.mdx$/, '');
      return {
        label: relative(process.cwd(), fullPath),
        href: `${options.baseUrl}/${pagePath}`,
        data: (frontmatter ? parseYaml(frontmatter) : null) ?? {},
      };
    });
}

/** Groups the pages with a `catalog.key` block by type and sorts them by name. */
function readEntries(
  catalog: CardCatalog,
  pages: Page[],
  fail: (message: string) => never,
): Map<string, Entry[]> {
  const byType = new Map<string, Entry[]>(catalog.sections.map(({ type }) => [type, []]));
  for (const { label, href, data: page } of pages) {
    const block = page[catalog.key];
    if (!block) continue;

    const failEntry = (message: string): never => fail(`${label} ${message}`);
    for (const key of ['name', 'description', 'type', 'icon']) {
      if (typeof block[key] !== 'string' || !block[key].trim()) {
        failEntry(`has no ${catalog.key}.${key}`);
      }
    }
    const list =
      byType.get(block.type) ?? failEntry(`has an unknown ${catalog.key}.type "${block.type}"`);
    if (!isIcon(block.icon)) {
      failEntry(
        `has a ${catalog.key}.icon that is not a brand or lucide-react icon: "${block.icon}"`,
      );
    }

    list.push({
      name: block.name,
      description: block.description,
      icon: block.icon,
      href,
      ...catalog.read(block, page, failEntry),
    });
  }
  for (const list of byType.values()) {
    list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'en'));
  }
  return byType;
}

type CardProps = { href: string; icon: string; title: string; tags: string[]; isNew?: boolean };

/** Writes the MDX of one `CatalogCard` with `description` as its text. */
const cardMdx = ({ href, icon, title, tags, isNew }: CardProps, description: string) => {
  const props = [
    `href={${JSON.stringify(href)}}`,
    `icon={<${icon} />}`,
    `title={${JSON.stringify(title)}}`,
    tags.length > 0 && `tags={${JSON.stringify(tags)}}`,
    isNew && 'isNew',
  ].filter(Boolean);
  return [`<CatalogCard ${props.join(' ')}>`, escapeText(description.trim()), '</CatalogCard>'];
};

/** Writes the MDX for the list: a `CardFilter` with one group per section. */
function toMdx(
  catalog: CardCatalog,
  byType: Map<string, Entry[]>,
): { mdx: string; icons: string[] } {
  const all = [...byType.values()].flat();
  // A filter that keeps no card or every card changes nothing, so it gets no button.
  const usedFilters = catalog.filters.filter(
    (filter) =>
      all.some(({ tags }) => filter.has(tags)) && !all.every(({ tags }) => filter.has(tags)),
  );
  const lines = [
    `<CardFilter filters={${JSON.stringify(usedFilters.map(({ value, label }) => ({ value, label })))}} search empty=${JSON.stringify(catalog.empty)}>`,
  ];
  for (const { type, heading } of catalog.sections) {
    const list = byType.get(type) ?? [];
    if (list.length === 0) continue;
    lines.push('<CardFilter.Group>', '', `## ${heading}`, '', '<Cards>');
    for (const entry of list) {
      const filter = usedFilters.filter((item) => item.has(entry.tags)).map(({ value }) => value);
      lines.push(
        `<CardFilter.Item filter={${JSON.stringify(filter)}}>`,
        ...cardMdx({ ...entry, title: entry.name }, entry.description),
        '</CardFilter.Item>',
      );
    }
    lines.push('</Cards>', '</CardFilter.Group>');
  }
  lines.push('</CardFilter>');
  const icons = [...new Set(all.map(({ icon }) => icon))].sort();
  return { mdx: lines.join('\n'), icons };
}

/** Turns a card catalog config into a catalog. */
const cardCatalog = (catalog: CardCatalog): Catalog =>
  pathCatalog(catalog.tag, (pages, fail) => toMdx(catalog, readEntries(catalog, pages, fail)));

const incidentSeverities = ['low', 'medium', 'high', 'critical'];

/** Filter value for a product, for example `ui-component` for "UI Component". */
const productFilter = (product: string) => product.toLowerCase().replace(/\s+/g, '-');

/**
 * Lists every page in the folder from its `incident` frontmatter and `meta.description`, newest
 * first, with one filter per product.
 */
const incidents = pathCatalog('Incidents', (pages, fail) => {
  const entries = pages.map(({ label, href, data }) => {
    const failEntry = (message: string): never => fail(`${label} ${message}`);
    const text = (value: unknown, name: string): string =>
      typeof value === 'string' && value.trim() ? value : failEntry(`has no ${name}`);
    const block = data.incident;
    if (!block || typeof block !== 'object') failEntry('has no incident block');
    const date = text(block.date, 'incident.date');
    const time = new Date(date).getTime();
    if (Number.isNaN(time)) failEntry(`has an incident.date that is not a valid date: "${date}"`);
    if (block.status !== 'resolved') {
      failEntry(`has an incident.status that is not "resolved": "${block.status}"`);
    }
    if (!incidentSeverities.includes(block.severity)) {
      failEntry(
        `has an incident.severity that is not ${incidentSeverities.join(', ')}: "${block.severity}"`,
      );
    }
    return {
      href,
      time,
      date,
      title: text(data.title, 'title'),
      description: text(data.meta?.description, 'meta.description'),
      product: text(block.product, 'incident.product'),
      status: block.status as string,
      severity: block.severity as string,
    };
  });
  entries.sort((a, b) => b.time - a.time || a.href.localeCompare(b.href, 'en'));

  const products = [...new Set(entries.map(({ product }) => product))].sort((a, b) =>
    a.localeCompare(b, 'en'),
  );
  const filters = products.map((product) => ({ value: productFilter(product), label: product }));
  const lines = [
    `<CardFilter filters={${JSON.stringify(filters)}} empty="No incidents found.">`,
    '<Cards>',
  ];
  for (const entry of entries) {
    const props = [
      `href={${JSON.stringify(entry.href)}}`,
      `title={${JSON.stringify(entry.title)}}`,
      `severity={${JSON.stringify(entry.severity)}}`,
      `status={${JSON.stringify(entry.status)}}`,
      `date={${JSON.stringify(entry.date)}}`,
      `product={${JSON.stringify(entry.product)}}`,
    ];
    lines.push(
      `<CardFilter.Item filter={${JSON.stringify([productFilter(entry.product)])}}>`,
      `<IncidentCard ${props.join(' ')}>`,
      escapeText(entry.description.trim()),
      '</IncidentCard>',
      '</CardFilter.Item>',
    );
  }
  lines.push('</Cards>', '</CardFilter>');
  return { mdx: lines.join('\n'), icons: [] };
});

type FeatureEntry = (typeof featureCatalog.entries)[number];

/** Checks that the catalog is used in the latest docs and every entry has a known icon. */
const checkFeatureCatalog = ({ options, fail }: BuildContext) => {
  if (options.baseUrl !== docsRoute) fail(`is only for the docs at ${docsRoute}`);
  for (const { name, icon } of featureCatalog.entries) {
    if (!isIcon(icon))
      fail(`entry "${name}" has an icon that is not a brand or lucide-react icon: "${icon}"`);
  }
};

const featureCard = (entry: FeatureEntry) =>
  cardMdx(
    { href: entry.url, icon: entry.icon, title: entry.name, tags: entry.tags },
    entry.description,
  );

const featureIcons = (entries: FeatureEntry[]) =>
  [...new Set(entries.map(({ icon }) => icon))].sort();

/**
 * Every entry of `feature-catalog.json`: a `CardFilter` with search and one button per plan, and
 * one group per catalog group with an `h2`.
 */
const featureCatalogAll: Catalog = {
  tag: 'FeatureCatalog',
  props: [],
  build: (_props, context) => {
    checkFeatureCatalog(context);
    const lines = [
      `<CardFilter filters={${JSON.stringify(featureCatalog.plans)}} search empty="No features match your filters.">`,
    ];
    for (const group of featureCatalog.groups) {
      lines.push(
        '<CardFilter.Group>',
        '',
        `## ${escapeText(group.title)} [#${group.id}]`,
        '',
        '<Cards>',
      );
      for (const entry of featureCatalog.entries.filter((item) => item.group === group.id)) {
        lines.push(
          `<CardFilter.Item filter={${JSON.stringify([entry.plan])}}>`,
          ...featureCard(entry),
          '</CardFilter.Item>',
        );
      }
      lines.push('</Cards>', '</CardFilter.Group>');
    }
    lines.push('</CardFilter>');
    return { mdx: lines.join('\n'), icons: featureIcons(featureCatalog.entries) };
  },
};

/** The entries of the catalog group `id` as `Cards`, without a filter. */
const featureCatalogGroup: Catalog = {
  tag: 'CatalogGroup',
  props: ['id'],
  build: ({ id }, context) => {
    checkFeatureCatalog(context);
    if (!featureCatalog.groups.some((group) => group.id === id)) {
      context.fail(`has an unknown id "${id}"`);
    }
    const entries = featureCatalog.entries.filter((entry) => entry.group === id);
    const mdx = ['<Cards>', ...entries.flatMap(featureCard), '</Cards>'].join('\n');
    return { mdx, icons: featureIcons(entries) };
  },
};

const catalogs = new Map(
  [
    cardCatalog(extensions),
    cardCatalog(uiComponents),
    incidents,
    featureCatalogAll,
    featureCatalogGroup,
  ].map((catalog) => [catalog.tag, catalog]),
);

/** Removes source positions, so the node is not output in the processed Markdown. */
const stripPositions = (node: Node) => {
  delete node.position;
  node.children?.forEach(stripPositions);
};

const parser = remark().use(remarkMdx);

/**
 * Remark plugin. Replaces each top-level catalog tag with a card list:
 * - `<Extensions path="…" />`, `<UIComponents path="…" />` and `<Incidents path="…" />`: a
 *   filterable list of the pages under `path`, read from their `extension`, `component` or
 *   `incident` frontmatter. `path` is relative to `options.dir`.
 * - `<FeatureCatalog />` and `<CatalogGroup id="…" />`: all features or one group of
 *   `feature-catalog.json`. Only in the latest docs.
 * Throws an error that names the page on wrong props, a `path` that does not exist, a listed page
 * with incomplete data, an unknown group or an icon that is neither a brand icon nor a
 * `lucide-react` icon. Imports brand icons from `@/components/brand-icons` and the other icons from
 * `lucide-react`.
 */
export function remarkCatalogs(options: RemarkCatalogsOptions) {
  return (tree: Node, file: File) => {
    const imports = new Set<string>();
    tree.children = (tree.children ?? []).flatMap((node) => {
      const catalog = node.type === 'mdxJsxFlowElement' && catalogs.get(node.name ?? '');
      if (!catalog) return [node];
      const fail = (message: string): never => {
        throw new Error(`${file.path}: <${catalog.tag}> ${message}`);
      };
      const attributes = node.attributes ?? [];
      const props = Object.fromEntries(
        attributes.map((attribute) => [attribute.name, attribute.value]),
      );
      if (
        attributes.length !== catalog.props.length ||
        catalog.props.some((name) => typeof props[name] !== 'string')
      ) {
        fail(
          catalog.props.length === 0
            ? 'must have no props'
            : `must have exactly these string props: ${catalog.props.map((name) => `"${name}"`).join(', ')}`,
        );
      }
      const { mdx, icons } = catalog.build(props as Record<string, string>, {
        options,
        addDependency: (dependency) => file.data._compiler?.addDependency(dependency),
        fail,
      });
      for (const icon of icons) imports.add(icon);
      const children = (parser.parse(mdx) as unknown as Node).children ?? [];
      // Adds the list to the processed Markdown, in place of the tag.
      type Embed = Parameters<typeof embedSource>;
      embedSource(file as Embed[0], node as Embed[1], mdx, children as Embed[3]);
      return children;
    });

    const names = [...imports].sort();
    const statements = [
      [names.filter(isBrandIcon), brandIconsModule],
      [names.filter((name) => !isBrandIcon(name)), 'lucide-react'],
    ]
      .filter(([list]) => list.length > 0)
      .map(([list, module]) => `import { ${(list as string[]).join(', ')} } from '${module}'`);
    if (statements.length > 0) {
      const esm = parser.parse(statements.join('\n')) as unknown as Node;
      stripPositions(esm);
      tree.children.unshift(...(esm.children ?? []));
    }
  };
}
