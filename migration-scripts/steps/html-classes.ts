import type { Edit } from '../component-mapping.ts';
import {
  contentChildren,
  isJsxElement,
  lineIndent,
  type MdNode,
  offsets,
  reindent,
} from '../mdast.ts';

const gridClass = 'grid gap-20';

/** Old classes of the old app and their Fumadocs replacements. */
const classReplacements: Record<string, string> = {
  'text-grayAlpha-600': 'text-fd-muted-foreground',
  'hover:text-grayAlpha-800': 'hover:text-fd-foreground',
  'text-grayAlpha-300': 'text-fd-border',
};
const oldClassPattern = /grayAlpha/;
const classProps = ['className', 'class'];

const lineOf = (source: string, offset: number) => source.slice(0, offset).split('\n').length;

/** True if `text` ends with a blank line, or is empty. */
const endsWithBlankLine = (text: string) => text === '' || /\n[ \t]*\n[ \t]*$/.test(text);

/** Returns the classes of a `div` with `grid` and `gap-20` classes, or null for other nodes. */
const gridClasses = (node: MdNode) => {
  if (!isJsxElement(node) || node.name !== 'div') return null;
  const classAttribute = node.attributes?.find(
    (attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'className',
  );
  const classes = typeof classAttribute?.value === 'string' ? classAttribute.value : '';
  const tokens = classes.split(/\s+/);
  return tokens.includes('grid') && tokens.includes('gap-20') ? classes : null;
};

/** Returns the first grid `div` in `node` or below it. */
const findGrid = (node: MdNode): MdNode | undefined =>
  gridClasses(node) ? node : (node.children ?? []).map(findGrid).find(Boolean);

/** Returns the edit that replaces one grid `div` with its children, moved to the div's indent. */
const gridWrapperEdit = (label: string, source: string, node: MdNode, classes: string): Edit => {
  const { start, end } = offsets(node);
  const fail = (message: string): never => {
    throw new Error(`${label}:${lineOf(source, start)}: <div className="${classes}"> ${message}`);
  };
  if (classes !== gridClass || node.attributes?.length !== 1) fail('has another shape');
  if (node.type !== 'mdxJsxFlowElement') fail('is not on its own lines');

  const children = contentChildren(node);
  if (children.length === 0) fail('has no children');
  if (children.some(findGrid)) fail('has another grid div inside');
  const indent = lineIndent(source, start) ?? fail('does not start a line');
  const lineStart = start - indent.length;
  if (!endsWithBlankLine(source.slice(0, lineStart))) fail('has no blank line before it');
  const childStart = offsets(children[0]).start;
  const childIndent = lineIndent(source, childStart) ?? fail('has content on the line of its tag');
  const childEnd = offsets(children[children.length - 1]).end;
  if (!/^[ \t]*\n\s*<\/div>$/.test(source.slice(childEnd, end))) {
    fail('has a closing tag that is not on its own line');
  }
  const childText = reindent(source.slice(childStart, childEnd), childIndent, indent);
  return { start: lineStart, end, text: `${indent}${childText}` };
};

/**
 * Returns the edits that remove the tags of every `<div className="grid gap-20">` on a page and
 * move its children to the div's own indent. Each edit spans all lines of the div, so apply these
 * edits and parse the page again before other edits. Throws on a `div` with `grid` and `gap-20`
 * classes of any other shape.
 */
export const gridWrapperEdits = (label: string, source: string, tree: MdNode): Edit[] => {
  const edits: Edit[] = [];
  const visit = (node: MdNode) => {
    const classes = gridClasses(node);
    if (classes !== null) {
      edits.push(gridWrapperEdit(label, source, node, classes));
      return;
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(tree);
  return edits;
};

type EsNode = {
  type?: string;
  start?: number;
  end?: number;
  [key: string]: unknown;
};

/**
 * Returns the edits that replace the old classes in the props of a JSX element, or in the JSX of an
 * expression or `export`, with their Fumadocs classes. Visits only this node's own props and
 * expression, not its children. Throws on an old class it cannot replace, and on an old class
 * outside a plain class string. MDX comments are not read.
 */
export const oldClassEdits = (label: string, source: string, node: MdNode): Edit[] => {
  const fail = (offset: number, message: string): never => {
    throw new Error(`${label}:${lineOf(source, offset)}: ${message}`);
  };

  /** Returns the edit for one class string at `start`, or null when nothing changes. */
  const classEdit = (start: number, value: string): Edit | null => {
    const replaced = value.replace(/\S+/g, (token) => classReplacements[token] ?? token);
    const left = replaced.split(/\s+/).find((token) => oldClassPattern.test(token));
    if (left) fail(start, `has the old class "${left}", which has no replacement`);
    return replaced === value ? null : { start, end: start + value.length, text: replaced };
  };

  const edits: Edit[] = [];
  const visitEstree = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      for (const child of value) visitEstree(child);
      return;
    }
    const esNode = value as EsNode;
    if (esNode.type === 'JSXAttribute') {
      const name = (esNode.name as EsNode).name as string;
      const attributeValue = esNode.value as EsNode | null;
      if (classProps.includes(name) && attributeValue?.type === 'Literal') {
        const start = attributeValue.start as number;
        const raw = source.slice(start, attributeValue.end);
        const text = attributeValue.value as string;
        if (raw !== `"${text}"` && raw !== `'${text}'`) {
          if (oldClassPattern.test(raw)) fail(start, `has old classes the script cannot read`);
          return;
        }
        const edit = classEdit(start + 1, text);
        if (edit) edits.push(edit);
        return;
      }
    }
    if (
      (esNode.type === 'Literal' && typeof esNode.value === 'string') ||
      esNode.type === 'TemplateElement'
    ) {
      const raw = source.slice(esNode.start, esNode.end);
      if (oldClassPattern.test(raw))
        fail(esNode.start as number, 'has an old class outside a class prop');
      return;
    }
    for (const [key, child] of Object.entries(esNode)) {
      if (key !== 'loc' && key !== 'range' && key !== 'comments') visitEstree(child);
    }
  };

  if (!isJsxElement(node)) {
    visitEstree(node.data?.estree);
    return edits;
  }
  for (const attribute of node.attributes ?? []) {
    const { start, end } = offsets(attribute);
    if (attribute.type !== 'mdxJsxAttribute' || typeof attribute.value !== 'string') {
      visitEstree(
        attribute.type === 'mdxJsxAttribute'
          ? (attribute.value as MdNode | null)?.data?.estree
          : attribute.data?.estree,
      );
      continue;
    }
    const name = attribute.name as string;
    const value = attribute.value;
    if (!oldClassPattern.test(value)) continue;
    if (!classProps.includes(name)) fail(start, `has an old class in the "${name}" prop`);
    const raw = source.slice(start, end);
    if (raw !== `${name}="${value}"` && raw !== `${name}='${value}'`) {
      fail(start, `has a "${name}" prop the script cannot read`);
    }
    const edit = classEdit(start + name.length + 2, value);
    if (edit) edits.push(edit);
  }
  return edits;
};
