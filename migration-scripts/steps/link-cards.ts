import type { ShapeStep } from '../component-mapping.ts';
import {
  childrenSource,
  contentChildren,
  hasProps,
  isJsxElement,
  lineIndent,
  type MdNode,
  offsets,
  plainText,
  reindent,
  stringProps,
} from '../mdast.ts';

const wrapperClasses = [
  'grid md:grid-cols-2 gap-4 mt-6 md:items-start',
  'grid md:grid-cols-2 gap-6 mt-6 md:items-start',
];
const cardClass =
  'flex flex-col p-4 border border-grayAlpha-200 rounded-lg hover:border-grayAlpha-300 transition-colors cursor-pointer no-underline';

/** A tag on one line is parsed as a paragraph that holds it. Returns the tag. */
const unwrap = (node: MdNode) => {
  const children = contentChildren(node);
  return node.type === 'paragraph' && children.length === 1 && isJsxElement(children[0])
    ? children[0]
    : node;
};

const isElement = (node: MdNode | undefined, name: string, className: string) =>
  node !== undefined && isJsxElement(node) && node.name === name && hasProps(node, { className });

/**
 * Returns the `href` prop node, title node and text node of one hand-made card. Calls `fail` with
 * the reason for another shape.
 */
const readCard = (card: MdNode, fail: (message: string) => never) => {
  const props = stringProps(card);
  if (card.name !== 'Link' || props?.size !== 2 || props.get('className') !== cardClass) {
    fail('has a child that is not a card <Link>');
  }
  const href = card.attributes?.find((attribute) => attribute.name === 'href');
  const [header, body, ...rest] = contentChildren(card).map(unwrap);
  if (href === undefined || rest.length > 0) fail('has a card with other content');
  if (!isElement(header, 'div', 'flex items-center justify-between mb-2')) {
    fail('has a card with another header');
  }
  if (!isElement(body, 'div', 'text-sm text-grayAlpha-700')) fail('has a card with another text');

  // On separate lines, the title and the label are one paragraph.
  let headerChildren = contentChildren(header);
  if (headerChildren.length === 1 && headerChildren[0].type === 'paragraph') {
    headerChildren = contentChildren(headerChildren[0]);
  }
  const [title, more, ...headerRest] = headerChildren;
  if (headerRest.length > 0 || !isElement(title, 'h4', 'font-semibold text-black')) {
    fail('has a card with another title');
  }
  if (
    !isElement(more, 'span', 'text-sm text-blue-600 font-medium whitespace-nowrap ml-4') ||
    plainText(more).trim() !== 'More →'
  ) {
    fail('has a card with another label');
  }
  return { href: href as MdNode, title, body };
};

/**
 * Rewrites a hand-made link card grid (a `div` with a card grid class, holding only `Link` cards)
 * to Fumadocs `Cards` and `Card`. Drops the "More →" label. Copies titles and texts unchanged.
 * Throws on a card grid or a card `Link` of any other shape.
 */
export const linkCards: ShapeStep = {
  name: 'hand-made link cards',
  edits: ({ label, source, node }) => {
    const className = stringProps(node)?.get('className');
    if (node.name === 'Link' && className === cardClass) {
      throw new Error(`${label}: hand-made link card outside a card grid`);
    }
    if (node.name !== 'div' || !wrapperClasses.includes(className ?? '')) return null;

    const line = node.position?.start.line;
    const fail = (message: string): never => {
      throw new Error(`${label}:${line}: hand-made link card grid ${message}`);
    };
    if (!hasProps(node, { className: className as string })) fail('has other props');
    const { start, end } = offsets(node);
    const indent = lineIndent(source, start) ?? fail('does not start a line');

    const cards = contentChildren(node).map((child) => {
      const card = readCard(child, fail);
      const titleSource = childrenSource(source, card.title);
      if (!/^[^"{}<>\n]*$/.test(titleSource)) fail(`has a title that is not plain text`);
      const bodyText = childrenSource(source, card.body);
      const bodyIndent = lineIndent(source, offsets(card.body.children?.[0] ?? card.body).start);
      if (bodyIndent === null && bodyText.includes('\n'))
        fail('has a card text the script cannot indent');
      const text = reindent(bodyText, bodyIndent ?? '', `${indent}    `);
      return [
        `${indent}  <Card title="${titleSource}" ${source.slice(offsets(card.href).start, offsets(card.href).end)}>`,
        `${indent}    ${text}`,
        `${indent}  </Card>`,
      ].join('\n');
    });
    if (cards.length === 0) fail('has no cards');
    return [{ start, end, text: ['<Cards>', ...cards, `${indent}</Cards>`].join('\n') }];
  },
};
