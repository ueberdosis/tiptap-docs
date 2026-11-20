import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import * as lucide from 'lucide-react';
import { isBrandIcon } from '../../src/lib/brand-icons.ts';
import type { ShapeStep } from '../component-mapping.ts';
import { resolvePageLink } from '../links.ts';
import { offsets } from '../mdast.ts';
import { type Fail, isPlainParagraph, readProps, tag } from './cards.ts';

const appDir = dirname(dirname(import.meta.dirname));
const sourceFile = join(
  import.meta.dirname,
  '../.sources/tiptap-docs-main/src/components/UseCasesGrid.tsx',
);

type UseCase = { title: string; description: string; href: string; tag: string; icon: string };
type Section = { title: string; useCases: UseCase[] };

/** The lists in the source, by `variant`. */
const lists: Record<string, string> = {
  client: 'CLIENT_USE_CASES',
  generation: 'GENERATION_USE_CASES',
};
/** The sections in render order: tag and title. An empty title writes no heading. */
const sectionTitles: [string, string][] = [
  ['AI Agents', 'AI agents'],
  ['Workflows', 'Custom workflows'],
  ['Basic AI Generation', ''],
];
const fields = ['title', 'description', 'href', 'tags', 'icon'];

const failSource: Fail = (message) => {
  throw new Error(`UseCasesGrid.tsx: ${message}`);
};

const stringLiteral = String.raw`'[^'\\\n]*'`;
const identifier = '[A-Za-z_$][\\w$]*';

/** Returns the text from `open` to its matching bracket, without both. Skips single-quoted strings. */
const bracketBody = (text: string, open: number) => {
  const pairs: Record<string, string> = { '[': ']', '{': '}' };
  const stack: string[] = [];
  for (let index = open; index < text.length; index += 1) {
    const char = text[index];
    if (char === "'") {
      const close = text.indexOf("'", index + 1);
      if (close === -1) failSource('has a string without an end');
      index = close;
    } else if (char in pairs) {
      stack.push(pairs[char]);
    } else if (char === ']' || char === '}') {
      if (stack.pop() !== char) failSource(`has an unexpected "${char}"`);
      if (stack.length === 0) return text.slice(open + 1, index);
    }
  }
  return failSource('has a bracket without an end');
};

/** Reads one item object body. Throws on any field or value of another shape. */
const readItem = (list: string, body: string, position: number): UseCase => {
  const where = `${list} item ${position}`;
  const values = new Map<string, string | string[]>();
  const pattern = new RegExp(
    String.raw`\s*(${identifier})\s*:\s*(${stringLiteral}|\[\s*(?:${stringLiteral}\s*,?\s*)*\]|${identifier})\s*(?:,|$)`,
    'y',
  );
  let read = 0;
  for (let match = pattern.exec(body); match; match = pattern.exec(body)) {
    read = pattern.lastIndex;
    const [, name, raw] = match;
    if (!fields.includes(name)) failSource(`${where} has an unknown field "${name}"`);
    if (values.has(name)) failSource(`${where} has the field "${name}" twice`);
    if (raw.startsWith("'")) values.set(name, raw.slice(1, -1));
    else if (raw.startsWith('[')) {
      values.set(
        name,
        [...raw.matchAll(new RegExp(stringLiteral, 'g'))].map((item) => item[0].slice(1, -1)),
      );
    } else values.set(name, `{${raw}}`);
  }
  const rest = body.slice(read).trim();
  if (rest !== '')
    failSource(`${where} has a field the script cannot read: "${rest.split('\n')[0]}"`);
  for (const name of fields) if (!values.has(name)) failSource(`${where} has no "${name}"`);

  const string = (name: string) => {
    const value = values.get(name);
    if (typeof value !== 'string' || value.startsWith('{')) {
      return failSource(`${where} has a "${name}" that is not a string`);
    }
    return value;
  };
  const tags = values.get('tags');
  if (!Array.isArray(tags)) failSource(`${where} has "tags" that are not an array of strings`);
  if ((tags as string[]).length !== 1) failSource(`${where} does not have exactly one tag`);
  const icon = values.get('icon');
  if (typeof icon !== 'string' || !icon.startsWith('{')) {
    failSource(`${where} has an "icon" that is not one identifier`);
  }
  return {
    title: string('title'),
    description: string('description'),
    href: string('href'),
    tag: (tags as string[])[0],
    icon: (icon as string).slice(1, -1),
  };
};

/** Names imported from `lucide-react`, without `type` imports. */
const lucideImports = (text: string) => {
  const imports = [...text.matchAll(/import\s*\{([^}]*)\}\s*from\s*'lucide-react'/g)];
  if (imports.length !== 1) failSource('does not have one import from "lucide-react"');
  return new Set(
    imports[0][1]
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item && !item.startsWith('type ')),
  );
};

/** Checks that the render code still maps the tags to the section titles in `sectionTitles`. */
const checkRenderCode = (text: string) => {
  const flat = text.replace(/\s+/g, ' ');
  const filters = new Map(
    [
      ...flat.matchAll(
        /const (\w+) = useCases\.filter\(\(uc\) => uc\.tags\.includes\('([^']*)'\)\)/g,
      ),
    ].map((match) => [match[1], match[2]]),
  );
  const sections = [
    ...flat.matchAll(/<UseCaseSection title="([^"]*)" useCases=\{(\w+)\} \/>/g),
  ].map((match) => [filters.get(match[2]), match[1]]);
  if (
    filters.size !== sectionTitles.length ||
    (flat.match(/<UseCaseSection\b/g) ?? []).length !== sectionTitles.length ||
    JSON.stringify(sections) !== JSON.stringify(sectionTitles)
  ) {
    failSource(
      `has other sections than ${sectionTitles.map(([tagName, title]) => `"${tagName}" → "${title}"`).join(', ')}`,
    );
  }
  if (
    !flat.includes("React.FC<{ variant: 'client' | 'generation' }>") ||
    !flat.includes(
      "const useCases = variant === 'client' ? CLIENT_USE_CASES : GENERATION_USE_CASES",
    )
  ) {
    failSource(
      'has other variants than "client" (CLIENT_USE_CASES) and "generation" (GENERATION_USE_CASES)',
    );
  }
};

let sections: Map<string, Section[]> | undefined;

/** Reads and checks the use case lists once. Returns the sections per variant. */
const readSections = () => {
  if (sections) return sections;
  const text = readFileSync(sourceFile, 'utf8').replace(/^[ \t]*\/\/.*$/gm, '');
  const icons = lucideImports(text);
  checkRenderCode(text);

  const declared = [...text.matchAll(/const (\w+)(?:\s*:\s*[\w[\]]+)?\s*=\s*\[/g)];
  const names = declared.map((match) => match[1]).sort();
  if (JSON.stringify(names) !== JSON.stringify(Object.values(lists).sort())) {
    failSource(
      `has the lists ${names.join(', ') || 'none'}, not ${Object.values(lists).join(', ')}`,
    );
  }

  let itemCount = 0;
  sections = new Map();
  for (const [variant, list] of Object.entries(lists)) {
    const match = declared.find((item) => item[1] === list) as RegExpExecArray;
    const body = bracketBody(text, match.index + match[0].length - 1);
    const useCases: UseCase[] = [];
    let rest = body;
    while (rest.trim() !== '') {
      const open = rest.search(/\S/);
      if (rest[open] !== '{') failSource(`${list} has something that is not an item object`);
      const itemBody = bracketBody(rest, open);
      useCases.push(readItem(list, itemBody, useCases.length + 1));
      rest = rest.slice(open + itemBody.length + 2).replace(/^\s*,/, '');
    }
    const objects = (body.match(/(^|[[,]|\n)\s*\{/g) ?? []).length;
    if (objects !== useCases.length) {
      failSource(`${list} has ${objects} item objects, but the script read ${useCases.length}`);
    }
    itemCount += useCases.length;

    for (const useCase of useCases) {
      const where = `${list} item "${useCase.title}"`;
      if (!sectionTitles.some(([tagName]) => tagName === useCase.tag)) {
        failSource(`${where} has an unknown tag "${useCase.tag}"`);
      }
      if (!icons.has(useCase.icon)) {
        failSource(`${where} has an icon not imported from "lucide-react": "${useCase.icon}"`);
      }
      if (!Object.hasOwn(lucide, useCase.icon) || isBrandIcon(useCase.icon)) {
        failSource(
          `${where} has an icon that is not a lucide-react icon in this app: "${useCase.icon}"`,
        );
      }
      if (!isPlainParagraph(useCase.description)) {
        failSource(`${where} has a description the script cannot copy as text`);
      }
      if (/["{}<>]/.test(useCase.title)) failSource(`${where} has a title with "{}<> characters`);
      if (!/^\/[^\s"]*$/.test(useCase.href))
        failSource(`${where} has an "href" that is not a root link`);
    }

    const variantSections = sectionTitles
      .map(([tagName, title]) => ({
        title,
        useCases: useCases.filter((item) => item.tag === tagName),
      }))
      .filter((section) => section.useCases.length > 0);
    if (variantSections.some((section) => !section.title) && variantSections.length > 1) {
      failSource(`${list} has a section without a title next to other sections`);
    }
    sections.set(variant, variantSections);
  }

  const titleFields = (text.match(/\btitle\s*:\s*['"`]/g) ?? []).length;
  if (titleFields !== itemCount) {
    failSource(
      `has ${titleFields} "title" fields with a string, but the lists have ${itemCount} items`,
    );
  }
  return sections;
};

/**
 * Rewrites `<UseCasesGrid variant="…" />` to Fumadocs `Cards` with one `Card` per use case, from the
 * lists in `UseCasesGrid.tsx` of `tiptap-docs-main`. Titled sections get a `##` heading. Adds the
 * icon import from `lucide-react` to the page. Fixes the root links as `links.ts` does; prints a link
 * it cannot resolve and keeps it. Throws on any change in the shape of the source file or the tag.
 */
export const useCases: ShapeStep = {
  name: 'use cases',
  edits: ({ label, source, node }) => {
    if (node.name !== 'UseCasesGrid') return null;
    const fail: Fail = (message) => {
      throw new Error(`${label}: <UseCasesGrid> ${message}`);
    };
    if (!label.startsWith('content/docs/')) fail('is only supported in latest');
    const failProp: Fail = (message) => {
      throw new Error(`${label}: ${message}`);
    };
    const variant = readProps(source, node, failProp, { variant: 'string' }).get('variant')?.value;
    const variantSections = readSections().get(variant as string);
    if (!variantSections) fail(`has an unknown variant "${variant}"`);

    const { start, end } = offsets(node);
    if (
      source[start - 1] !== '\n' ||
      !/^\s*$/.test(source.slice(end, source.indexOf('\n', end) + 1 || undefined))
    ) {
      fail('is not on its own line');
    }
    if (source.includes("from 'lucide-react'"))
      fail('is on a page that already imports lucide-react');
    const frontmatter = /^---\n[\s\S]*?\n---\n/.exec(source);
    if (!frontmatter) fail('is on a page without frontmatter');

    const file = join(appDir, label);
    const href = (link: string) => {
      const result = resolvePageLink('latest', file, link);
      if (result.kind === 'ok') return result.text;
      console.log(`Unresolved use case link, kept as it is: ${label}  ${link}  (${result.reason})`);
      return link;
    };

    const blocks = (variantSections as Section[]).map((section) => {
      const cards = section.useCases.flatMap((useCase) =>
        tag(
          'Card',
          [
            `href="${href(useCase.href)}"`,
            `icon={<${useCase.icon} />}`,
            `title="${useCase.title}"`,
          ],
          [useCase.description],
        ),
      );
      const grid = tag('Cards', [], cards).join('\n');
      return section.title ? `## ${section.title}\n\n${grid}` : grid;
    });
    const icons = [
      ...new Set(
        (variantSections as Section[]).flatMap((section) =>
          section.useCases.map((item) => item.icon),
        ),
      ),
    ].sort();
    const importEnd = (frontmatter as RegExpExecArray)[0].length;
    return [
      {
        start: importEnd,
        end: importEnd,
        text: `\nimport { ${icons.join(', ')} } from 'lucide-react'\n`,
      },
      { start, end, text: blocks.join('\n\n') },
    ];
  },
};
