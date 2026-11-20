import type { ShapeStep } from '../component-mapping.ts';
import { childrenSource, contentChildren, lineIndent, type MdNode, offsets } from '../mdast.ts';
import { type Fail, inlineContainer, isNamed, readProps } from './cards.ts';

/** Node types that would change the item or need other steps when copied into a list item. */
const blockedTypes = new Set([
  'mdxJsxTextElement',
  'mdxJsxFlowElement',
  'mdxTextExpression',
  'mdxFlowExpression',
  'break',
]);

/** True if `node` or any node inside it has a type from `blockedTypes`. */
const hasBlocked = (node: MdNode): boolean =>
  blockedTypes.has(node.type) || (node.children ?? []).some(hasBlocked);

/** Returns the `CheckboxItem` elements of a `Checklist`. Calls `fail` on any other content. */
const checkboxItems = (node: MdNode, fail: Fail) =>
  contentChildren(node).flatMap((child) => {
    if (isNamed(child, 'CheckboxItem')) return [child];
    if (child.type !== 'paragraph') return fail('has content that is not a <CheckboxItem>');
    return contentChildren(child).map((part) =>
      isNamed(part, 'CheckboxItem') ? part : fail('has content that is not a <CheckboxItem>'),
    );
  });

/**
 * Returns the source of the inline content of a `CheckboxItem`. Calls `fail` on a prop, a block,
 * text on more than one line, a JSX element or expression, or text that would start a block.
 */
const itemSource = (source: string, node: MdNode, fail: Fail) => {
  readProps(source, node, fail, {});
  const container = node.type === 'mdxJsxFlowElement' ? inlineContainer(node) : node;
  const children = contentChildren(container);
  if (container.type === 'mdxJsxFlowElement' && children.length > 0) {
    fail('<CheckboxItem> has a block');
  }
  if (children.length === 0) fail('<CheckboxItem> is empty');
  if (children.some(hasBlocked)) fail('<CheckboxItem> has JSX or an expression');
  const text = childrenSource(source, container).trim();
  if (text.includes('\n')) fail('<CheckboxItem> has text on more than one line');
  if (/^([-+*#>|]|\d+[.)]|```)/.test(text)) fail('<CheckboxItem> has text that starts a block');
  return text;
};

/**
 * Rewrites a `Checklist` to a Markdown bullet list with one `- item` line per `CheckboxItem`.
 * Copies the item text unchanged. Writes the list without indent, with blank lines around it.
 * Throws on a `CheckboxItem` outside a `Checklist`, and on any other shape.
 */
export const checklists: ShapeStep = {
  name: 'Checklist',
  edits: ({ label, source, node }) => {
    const name = node.name ?? '';
    const failAt =
      (at: MdNode): Fail =>
      (message) => {
        throw new Error(`${label}:${at.position?.start.line}: ${message}`);
      };
    const fail: Fail = (message) => failAt(node)(`<${name}> ${message}`);
    if (name === 'CheckboxItem') return fail('is outside a <Checklist>');
    if (name !== 'Checklist') return null;
    if (node.type !== 'mdxJsxFlowElement') fail('is not a block');
    readProps(source, node, failAt(node), {});

    const items = checkboxItems(node, fail);
    if (items.length === 0) fail('has no <CheckboxItem>');
    const list = items.map((item) => `- ${itemSource(source, item, failAt(item))}`).join('\n');

    const { start, end } = offsets(node);
    if (lineIndent(source, start) !== '') fail('does not start a line without indent');
    const rest = source.slice(end);
    if (!/^[ \t]*(\n|$)/.test(rest)) fail('has content on the line of its closing tag');
    const before = /(^|\n[ \t]*\n)$/.test(source.slice(0, start)) ? '' : '\n';
    const after = /^[ \t]*(\n[ \t]*\n|\n?$)/.test(rest) ? '' : '\n';
    return [{ start, end, text: `${before}${list}${after}` }];
  },
};
