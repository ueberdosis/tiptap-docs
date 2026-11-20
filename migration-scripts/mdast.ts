/** Minimal shapes of the mdast and MDX nodes the component step reads, and helpers for them. */

export type Position = { start: { offset: number; line: number }; end: { offset: number } };

export type MdNode = {
  type: string;
  name?: string | null;
  value?: unknown;
  position?: Position;
  children?: MdNode[];
  attributes?: MdNode[];
  data?: { estree?: unknown };
};

/** Returns the start and end offset of a node in the page source. */
export const offsets = (node: MdNode) => {
  const position = node.position as Position;
  return { start: position.start.offset, end: position.end.offset };
};

/** True for a JSX element node, in flow or in text. */
export const isJsxElement = (node: MdNode) =>
  node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';

/**
 * Returns the props of a JSX element as name → value. Returns null if a prop is a spread or a
 * prop value is not a plain string.
 */
export const stringProps = (node: MdNode): Map<string, string> | null => {
  const props = new Map<string, string>();
  for (const attribute of node.attributes ?? []) {
    if (attribute.type !== 'mdxJsxAttribute' || typeof attribute.value !== 'string') return null;
    props.set(attribute.name as string, attribute.value);
  }
  return props;
};

/** True if the element has exactly these string props. */
export const hasProps = (node: MdNode, expected: Record<string, string>) => {
  const props = stringProps(node);
  return (
    props !== null &&
    props.size === Object.keys(expected).length &&
    Object.entries(expected).every(([name, value]) => props.get(name) === value)
  );
};

/** Returns the children without text nodes that hold only whitespace. */
export const contentChildren = (node: MdNode) =>
  (node.children ?? []).filter(
    (child) => !(child.type === 'text' && String(child.value).trim() === ''),
  );

/** Returns the text of a node and its children, as parsed (character references decoded). */
export const plainText = (node: MdNode): string =>
  node.type === 'text' ? String(node.value) : (node.children ?? []).map(plainText).join('');

/** Returns the source text from the start of the first child to the end of the last child. */
export const childrenSource = (source: string, node: MdNode) => {
  const children = node.children ?? [];
  if (children.length === 0) return '';
  return source.slice(offsets(children[0]).start, offsets(children[children.length - 1]).end);
};

/** Returns the whitespace between the line start and `offset`, or null if there is other text. */
export const lineIndent = (source: string, offset: number) => {
  const indent = source.slice(source.lastIndexOf('\n', offset - 1) + 1, offset);
  return /^[ \t]*$/.test(indent) ? indent : null;
};

/** Moves every line after the first from indent `from` to indent `to`. */
export const reindent = (text: string, from: string, to: string) =>
  text.replaceAll(`\n${from}`, `\n${to}`);
