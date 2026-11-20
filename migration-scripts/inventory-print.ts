/**
 * Prints `migration-scripts/inventory.json` as tables: a summary per version, then one table
 * per section with both versions combined.
 * Optional arguments filter the sections:
 * `components`, `html`, `frontmatter`, `imports`, `exports`, `expressions`.
 * Only reads the file. Run `pnpm migration:inventory` first.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { styleText } from 'node:util';

type Usage = { pageCount: number; examplePages: string[] };
type Tag = Usage & {
  name: string;
  sources?: string[];
  importPaths?: string[];
  props: { name: string }[];
  hasChildren: boolean;
};
type Import = Usage & { kind: string; path: string; location: string };
type VersionInventory = {
  pageCount: number;
  components: Tag[];
  htmlTags: Tag[];
  frontmatterFields: (Usage & { name: string; exampleValues: string[] })[];
  imports: Record<string, Omit<Import, 'kind'>[]>;
  exports: (Usage & { source: string })[];
  expressions: (Usage & { source: string })[];
};
type Cell = string | number;

const versionNames = ['latest', 'v2'] as const;
const sectionNames = ['components', 'html', 'frontmatter', 'imports', 'exports', 'expressions'];
const maxCellLength = 70;

const args = process.argv.slice(2);
for (const arg of args) {
  if (!sectionNames.includes(arg)) {
    console.error(`Unknown argument "${arg}". Use: ${sectionNames.join(', ')}`);
    process.exit(1);
  }
}
const sections =
  args.length > 0 ? sectionNames.filter((name) => args.includes(name)) : sectionNames;

const inventory: Record<string, VersionInventory> = JSON.parse(
  readFileSync(join(import.meta.dirname, 'inventory.json'), 'utf8'),
);

/** Puts a value on one line and cuts it to `maxCellLength` characters. */
const cell = (value: Cell) => {
  const line = String(value).replace(/\s+/g, ' ').trim();
  return line.length > maxCellLength ? `${line.slice(0, maxCellLength - 1)}…` : line;
};

/**
 * Prints a title with the row count and a table with a border.
 * Columns with only numbers and empty cells are right-aligned.
 */
const printTable = (title: string, headers: string[], rows: Cell[][], showCount = true) => {
  console.log();
  console.log(styleText('bold', showCount ? `${title} (${rows.length})` : title));
  const cells = rows.map((row) => row.map(cell));
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...cells.map((row) => row[index].length)),
  );
  const isNumber = headers.map(
    (_, index) =>
      rows.some((row) => typeof row[index] === 'number') &&
      rows.every((row) => typeof row[index] === 'number' || row[index] === ''),
  );
  const line = (left: string, middle: string, right: string) =>
    `${left}${widths.map((width) => '─'.repeat(width + 2)).join(middle)}${right}`;
  const format = (row: string[]) =>
    `│ ${row
      .map((value, index) =>
        isNumber[index] ? value.padStart(widths[index]) : value.padEnd(widths[index]),
      )
      .join(' │ ')} │`;

  console.log(line('┌', '┬', '┐'));
  console.log(styleText('bold', format(headers)));
  console.log(line('├', '┼', '┤'));
  for (const row of cells) console.log(format(row));
  console.log(line('└', '┴', '┘'));
};

/**
 * Builds rows for both versions: name, versions, pages per version, then `details`.
 * An item in both versions gets one row. With `splitOnDifference`, it gets one row per version,
 * directly beneath each other, when its `details` differ between the versions.
 */
const versionRows = <T>(
  items: Record<(typeof versionNames)[number], T[]>,
  name: (item: T) => string,
  pageCount: (item: T) => number,
  details: (item: T) => Cell[],
  splitOnDifference: boolean,
) => {
  const byVersion = versionNames.map(
    (version) => new Map(items[version].map((item) => [name(item), item])),
  );
  const names = [...new Set(byVersion.flatMap((map) => [...map.keys()]))].sort();
  const rows: Cell[][] = [];
  const pushRow = (itemName: string, perVersion: (T | undefined)[]) => {
    const first = perVersion.find((item) => item !== undefined);
    if (first === undefined) return;
    rows.push([
      itemName,
      versionNames.filter((_, index) => perVersion[index] !== undefined).join(', '),
      ...perVersion.map((item) => (item === undefined ? '' : pageCount(item))),
      ...details(first),
    ]);
  };
  for (const itemName of names) {
    const perVersion = byVersion.map((map) => map.get(itemName));
    const detailTexts = new Set(
      perVersion.flatMap((item) => (item === undefined ? [] : [JSON.stringify(details(item))])),
    );
    if (splitOnDifference && detailTexts.size > 1) {
      perVersion.forEach((item, index) => {
        pushRow(
          itemName,
          perVersion.map((_, other) => (other === index ? item : undefined)),
        );
      });
    } else {
      pushRow(itemName, perVersion);
    }
  }
  return rows;
};

const versionHeaders = ['Versions', ...versionNames.map((version) => `Pages ${version}`)];
const yesNo = (value: boolean) => (value ? 'yes' : 'no');
const propNames = (tag: Tag) => tag.props.map((prop) => prop.name).join(', ');
const importsOf = (version: VersionInventory): Import[] =>
  Object.entries(version.imports).flatMap(([kind, imports]) =>
    imports.map((item) => ({ ...item, kind })),
  );
const forVersions = <T>(select: (version: VersionInventory) => T[]) => ({
  latest: select(inventory.latest),
  v2: select(inventory.v2),
});
const usagePages = (item: Usage) => item.pageCount;

printTable(
  'Summary',
  [
    'Version',
    'Pages',
    'Components',
    'HTML tags',
    'Frontmatter',
    'Imports',
    'Exports',
    'Expressions',
  ],
  versionNames.map((name) => {
    const version = inventory[name];
    return [
      name,
      version.pageCount,
      version.components.length,
      version.htmlTags.length,
      version.frontmatterFields.length,
      importsOf(version).length,
      version.exports.length,
      version.expressions.length,
    ];
  }),
  false,
);

if (sections.includes('components')) {
  printTable(
    'Components',
    ['Name', ...versionHeaders, 'Source', 'Import path', 'Children', 'Props'],
    versionRows(
      forVersions((version) => version.components),
      (tag) => tag.name,
      usagePages,
      (tag) => [
        (tag.sources ?? []).join(', '),
        (tag.importPaths ?? []).join(', '),
        yesNo(tag.hasChildren),
        propNames(tag),
      ],
      true,
    ),
  );
}

if (sections.includes('html')) {
  printTable(
    'HTML tags',
    ['Name', ...versionHeaders, 'Children', 'Props'],
    versionRows(
      forVersions((version) => version.htmlTags),
      (tag) => tag.name,
      usagePages,
      (tag) => [yesNo(tag.hasChildren), propNames(tag)],
      true,
    ),
  );
}

if (sections.includes('frontmatter')) {
  printTable(
    'Frontmatter fields',
    ['Name', ...versionHeaders, 'Example value'],
    versionRows(
      forVersions((version) => version.frontmatterFields),
      (field) => field.name,
      usagePages,
      (field) => [field.exampleValues[0] ?? ''],
      false,
    ),
  );
}

if (sections.includes('imports')) {
  printTable(
    'Imports',
    ['Path', ...versionHeaders, 'Kind', 'Location'],
    versionRows(
      forVersions(importsOf),
      (item) => item.path,
      usagePages,
      (item) => [item.kind, item.location],
      false,
    ),
  );
}

for (const [section, title] of [
  ['exports', 'Exports'],
  ['expressions', 'Expressions'],
] as const) {
  if (!sections.includes(section)) continue;
  printTable(
    title,
    ['Source', ...versionHeaders, 'Example page'],
    versionRows(
      forVersions((version) => version[section]),
      (item) => item.source,
      usagePages,
      (item) => [item.examplePages[0]],
      false,
    ),
  );
}
console.log();
