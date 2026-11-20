/**
 * Rewrites the old components on the copied pages in `content/docs/` and `content/v2/`, based on
 * `component-mapping.ts`. Changes only the tags it maps, and the indent of the children of a
 * removed grid `div`. The rest of each file stays byte for byte the same. Expects the fresh output
 * of `copy.ts`.
 * Stops with an error on a prop or value without a rule, or a mapped component it cannot rewrite.
 * Writes the files only after all pages pass.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { componentMapping, type Edit, shapeSteps } from './component-mapping.ts';
import { isJsxElement, type MdNode, type Position } from './mdast.ts';
import { gridWrapperEdits, oldClassEdits } from './steps/html-classes.ts';

const appDir = dirname(import.meta.dirname);
const outputDirs = ['content/docs', 'content/v2'];

const parser = remark().use(remarkFrontmatter).use(remarkGfm).use(remarkMdx);

const walkFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walkFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );

/** Returns true if an estree node contains a JSX element with one of the mapped names. */
const hasMappedJsx = (node: unknown): boolean => {
  if (!node || typeof node !== 'object') return false;
  if (Array.isArray(node)) return node.some(hasMappedJsx);
  const value = node as { type?: string; name?: unknown; [key: string]: unknown };
  if (value.type === 'JSXOpeningElement') {
    const name = jsxName(value.name as JsxName);
    if (name in componentMapping) return true;
  }
  return Object.entries(value).some(
    ([key, child]) => key !== 'loc' && key !== 'range' && hasMappedJsx(child),
  );
};

type JsxName = {
  type: string;
  name?: unknown;
  object?: JsxName;
  property?: JsxName;
  namespace?: JsxName;
};

/** Returns the source text of a JSX element name, for example `Tabs.Item`. */
function jsxName(node: JsxName): string {
  if (node.type === 'JSXIdentifier') return node.name as string;
  if (node.type === 'JSXMemberExpression') {
    return `${jsxName(node.object as JsxName)}.${jsxName(node.property as JsxName)}`;
  }
  return `${jsxName(node.namespace as JsxName)}:${jsxName(node.name as JsxName)}`;
}

type EsNode = { type?: string; start?: number; end?: number; [key: string]: unknown };

/**
 * Returns the edits that rename mapped components inside the JSX of a prop value. Allows only
 * mappings without special code or defaults, and only props with the rule `keep`.
 */
const estreeEdits = (label: string, node: unknown): Edit[] => {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap((child) => estreeEdits(label, child));
  const value = node as EsNode;
  const edits: Edit[] = [];
  if (value.type === 'JSXElement') {
    const opening = value.openingElement as EsNode;
    const name = jsxName(opening.name as JsxName);
    const mapping = componentMapping[name];
    const fail = (message: string): never => {
      throw new Error(`${label}: <${name}> inside a prop ${message}`);
    };
    if (mapping) {
      if (mapping.shape) fail(`is only allowed inside the shape "${mapping.shape}"`);
      if (mapping.type === 'remove' || mapping.special || mapping.defaults) {
        fail('needs more than a rename, which is not supported');
      }
      for (const attribute of opening.attributes as EsNode[]) {
        if (attribute.type !== 'JSXAttribute') fail('has a spread prop');
        const prop = jsxName(attribute.name as JsxName);
        if (mapping.props[prop] !== 'keep') fail(`has a prop without a "keep" rule: "${prop}"`);
      }
      if (mapping.to !== name) {
        for (const element of [opening, value.closingElement as EsNode | null]) {
          const tagName = element?.name as EsNode | undefined;
          if (tagName) {
            edits.push({
              start: tagName.start as number,
              end: tagName.end as number,
              text: mapping.to,
            });
          }
        }
      }
    }
  }
  for (const [key, child] of Object.entries(value)) {
    if (key !== 'loc' && key !== 'range') edits.push(...estreeEdits(label, child));
  }
  return edits;
};

/** Returns the edits for one mapped element. Throws on anything without a rule. */
const elementEdits = (label: string, source: string, node: MdNode, topLevel: boolean): Edit[] => {
  const name = node.name as string;
  const mapping = componentMapping[name];
  const fail = (message: string): never => {
    throw new Error(`${label}: <${name}> ${message}`);
  };
  if (mapping.shape) fail(`is only allowed inside the shape "${mapping.shape}"`);
  if (mapping.type === 'remove') fail('has mapping type "remove", which is not supported yet');

  const start = (node.position as Position).start.offset;
  const end = (node.position as Position).end.offset;
  const nameEnd = start + 1 + name.length;
  if (source.slice(start, nameEnd) !== `<${name}`)
    fail('has an opening tag the script cannot read');

  const edits: Edit[] = mapping.special?.({ label, source, start, end, topLevel }) ?? [];
  const setProps = new Map<string, string>();
  let previousEnd = nameEnd;

  for (const attribute of node.attributes ?? []) {
    const attributeStart = (attribute.position as Position).start.offset;
    const attributeEnd = (attribute.position as Position).end.offset;
    if (attribute.type !== 'mdxJsxAttribute') fail('has a spread prop');
    edits.push(...estreeEdits(label, (attribute.value as MdNode | null)?.data?.estree));
    const prop = attribute.name as string;
    const rule = mapping.props[prop] ?? fail(`has a prop without a rule: "${prop}"`);

    if (rule === 'remove') {
      edits.push({ start: previousEnd, end: attributeEnd, text: '' });
    } else if (rule !== 'keep') {
      const other = setProps.get(rule.to);
      if (other) fail(`has both "${other}" and "${prop}", which both set "${rule.to}"`);
      setProps.set(rule.to, prop);
      if (rule.values) {
        const value = attribute.value;
        if (typeof value !== 'string') fail(`has a "${prop}" value that is not a string`);
        const mapped =
          rule.values[value as string] ?? fail(`has a "${prop}" value without a rule: "${value}"`);
        edits.push({ start: attributeStart, end: attributeEnd, text: `${rule.to}="${mapped}"` });
      } else if (rule.to !== prop) {
        edits.push({ start: attributeStart, end: attributeStart + prop.length, text: rule.to });
      }
    } else {
      setProps.set(prop, prop);
    }
    previousEnd = attributeEnd;
  }

  const added = Object.entries(mapping.defaults ?? {})
    .filter(([prop]) => !setProps.has(prop))
    .map(([prop, value]) => ` ${prop}="${value}"`)
    .join('');
  if (added) edits.push({ start: previousEnd, end: previousEnd, text: added });

  if (mapping.to !== name) {
    edits.push({ start: start + 1, end: nameEnd, text: mapping.to });
    if (!source.slice(start, end).endsWith('/>')) {
      const closing = source.lastIndexOf(`</${name}`, end);
      if (closing < start || source.slice(closing, end).replace(/\s/g, '') !== `</${name}>`) {
        fail('has a closing tag the script cannot read');
      }
      edits.push({ start: closing + 2, end: closing + 2 + name.length, text: mapping.to });
    }
  }
  return edits;
};

/** Applies non-overlapping edits, last first, so earlier offsets stay valid. */
const applyEdits = (source: string, edits: Edit[]) => {
  let output = source;
  for (const edit of [...edits].sort((a, b) => b.start - a.start || b.end - a.end)) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }
  return output;
};

const outputs = new Map<string, string>();
const counts: string[] = [];
for (const outputDir of outputDirs) {
  const pages = walkFiles(join(appDir, outputDir))
    .filter((file) => file.endsWith('.mdx'))
    .sort();
  const tagCounts = new Map<string, number>();

  for (const file of pages) {
    const label = relative(appDir, file);
    const original = readFileSync(file, 'utf8');
    const gridEdits = gridWrapperEdits(label, original, parser.parse(original) as MdNode);
    if (gridEdits.length > 0) {
      tagCounts.set('grid gap-20 div', (tagCounts.get('grid gap-20 div') ?? 0) + gridEdits.length);
    }
    const source = applyEdits(original, gridEdits);
    const tree = parser.parse(source) as MdNode;
    const edits: Edit[] = [];
    const classEdits: Edit[] = [];

    const visit = (node: MdNode, parent?: MdNode) => {
      if (
        node.type === 'mdxFlowExpression' ||
        node.type === 'mdxTextExpression' ||
        node.type === 'mdxjsEsm'
      ) {
        if (hasMappedJsx(node.data?.estree)) {
          throw new Error(`${label}: a mapped component inside a {…} expression or export`);
        }
        classEdits.push(...oldClassEdits(label, source, node));
        return;
      }
      if (isJsxElement(node)) {
        for (const step of shapeSteps) {
          const stepEdits = step.edits({ label, source, node });
          if (stepEdits) {
            edits.push(...stepEdits);
            tagCounts.set(step.name, (tagCounts.get(step.name) ?? 0) + 1);
            if (step.keepsChildren) {
              for (const child of node.children ?? []) visit(child, node);
            }
            return;
          }
        }
      }
      if (isJsxElement(node)) classEdits.push(...oldClassEdits(label, source, node));
      if (isJsxElement(node) && node.name && node.name in componentMapping) {
        edits.push(...elementEdits(label, source, node, parent === tree));
        tagCounts.set(node.name, (tagCounts.get(node.name) ?? 0) + 1);
      }
      for (const child of node.children ?? []) visit(child, node);
    };
    visit(tree);
    for (const classEdit of classEdits) {
      if (edits.some((edit) => classEdit.start < edit.end && edit.start < classEdit.end)) {
        throw new Error(`${label}: an old class inside a tag that another step rewrites`);
      }
    }
    edits.push(...classEdits);

    if (gridEdits.length > 0 || edits.length > 0) outputs.set(file, applyEdits(source, edits));
  }

  const summary = [...tagCounts]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([name, count]) => `${name} ${count}`)
    .join(', ');
  counts.push(`${outputDir}: ${summary || 'no mapped components'}`);
}

for (const [file, content] of outputs) writeFileSync(file, content);
console.log(counts.join('\n'));
console.log(`Changed ${outputs.size} pages`);
