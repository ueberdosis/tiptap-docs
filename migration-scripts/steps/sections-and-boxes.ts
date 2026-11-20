import type { Edit, ShapeStep } from '../component-mapping.ts';
import { childrenSource, contentChildren, lineIndent, type MdNode, offsets } from '../mdast.ts';
import {
  bodyLines,
  type Fail,
  inlineContainer,
  isNamed,
  namedParts,
  onlyPart,
  type Prop,
  parts,
  plainSource,
  readProps,
  tag,
} from './cards.ts';

/** Old component names. Each is only allowed inside its `CtaBox` or `ImageCard`. */
const partNames = [
  'CtaBox.Title',
  'CtaBox.Description',
  'CtaBox.List',
  'CtaBox.ListItem',
  'CtaBox.Actions',
  'ImageCard.Image',
  'ImageCard.Content',
  'ImageCard.Title',
  'ImageCard.Paragraph',
  'Button',
];

const ctaBoxVariants = ['light', 'dark'];
const ctaBoxClass = 'mt-12';
const ctaActionsClass = '-mx-3';
const ctaButtonClass = 'text-white/80 hover:text-white/100';
const ctaArrowClass = 'w-4 h-4';
const imageButtonsClass = 'flex items-center gap-2 mt-8';
const imageButtonVariants = ['secondary', 'tertiary', 'tertirary'];
const imageArrowClass = 'size-4';

const textPattern = /^[^"{}<>*_`[\]\\\n#]+$/;
const urlPattern = /^[^\s()<>]+$/;

/**
 * Returns the value of a string prop written as `name="value"`. Calls `fail` on other text. With
 * `startsBlock`, also on text that Markdown would read as a list at the start of a line.
 */
const stringValue = (prop: Prop, name: string, fail: Fail, startsBlock = false) => {
  const prefix = `${name}="`;
  if (!prop.source.startsWith(prefix) || !prop.source.endsWith('"')) {
    fail(`has a "${name}" prop the script cannot copy`);
  }
  const value = prop.source.slice(prefix.length, -1);
  if (!textPattern.test(value) || (startsBlock && /^[-+\d]/.test(value))) {
    fail(`has a "${name}" value the script cannot copy as text`);
  }
  return value;
};

/** Returns `[label](url)` for a `moreLink={{ label, url }}` prop. Calls `fail` on another shape. */
const moreLinkSource = (node: MdNode, fail: Fail) => {
  const value = node.attributes?.find((attribute) => attribute.name === 'moreLink')
    ?.value as MdNode;
  const program = value.data?.estree as {
    body: {
      expression?: {
        type: string;
        properties: { type: string; key: { name?: string }; value: { value?: unknown } }[];
      };
    }[];
  };
  const object = program.body[0]?.expression;
  if (program.body.length !== 1 || object?.type !== 'ObjectExpression') {
    fail('has a "moreLink" that is not an object');
  }
  const fields = new Map<string, unknown>();
  for (const property of object?.properties ?? []) {
    if (property.type !== 'Property') fail('has a "moreLink" with a spread');
    fields.set(property.key.name ?? '', property.value.value);
  }
  const label = fields.get('label');
  const url = fields.get('url');
  if (fields.size !== 2 || typeof label !== 'string' || typeof url !== 'string') {
    fail('has a "moreLink" without exactly a string "label" and "url"');
  }
  if (!textPattern.test(label as string) || !urlPattern.test(url as string)) {
    fail('has a "moreLink" the script cannot copy as a Markdown link');
  }
  return `[${label}](${url})`;
};

/** True if `text` ends with a blank line, or is empty. */
const endsWithBlankLine = (text: string) => text === '' || /\n[ \t]*\n[ \t]*$/.test(text);

/**
 * Replaces the tags of a `Section` with a `##` heading and its description as a paragraph before
 * the children, and its `moreLink` as a Markdown link after them. Writes these without indent, with
 * blank lines around them. Leaves the children unchanged.
 */
const section = (source: string, node: MdNode, fail: Fail): Edit[] => {
  const props = readProps(
    source,
    node,
    fail,
    { title: 'string' },
    { description: 'string', moreLink: 'expression' },
  );
  const children = contentChildren(node);
  if (children.length === 0) fail('has no children');

  const { start, end } = offsets(node);
  const indent = lineIndent(source, start) ?? fail('does not start a line');
  const childStart = offsets(children[0]).start;
  const childIndent = lineIndent(source, childStart) ?? fail('has content on the line of its tag');
  const childEnd = offsets(children[children.length - 1]).end;

  const blocks = [`## ${stringValue(props.get('title') as Prop, 'title', fail)}`];
  const description = props.get('description');
  if (description) blocks.push(stringValue(description, 'description', fail, true));
  const lineStart = start - indent.length;
  const before = endsWithBlankLine(source.slice(0, lineStart)) ? '' : '\n';
  const opening = {
    start: lineStart,
    end: childStart - childIndent.length,
    text: `${before}${blocks.join('\n\n')}\n\n`,
  };

  if (!props.has('moreLink')) return [opening, { start: childEnd, end, text: '' }];
  const rest = source.slice(end);
  const after =
    /^[ \t]*\n[ \t]*\n/.test(rest) || /^\s*$/.test(rest) || /^\n[ \t]*<Section[\s>]/.test(rest)
      ? ''
      : '\n';
  return [opening, { start: childEnd, end, text: `\n\n${moreLinkSource(node, fail)}${after}` }];
};

/**
 * Returns the label and href of a `Button asChild` holding one link (`a`, or `Link`, which maps to
 * `a`) with text and an arrow icon.
 */
const buttonAction = (
  source: string,
  button: MdNode,
  fail: Fail,
  variants: string[],
  buttonClass: string | null,
  arrowClass: string,
) => {
  if (!isNamed(button, 'Button')) fail('has a button that is not a <Button>');
  const props = readProps(
    source,
    button,
    fail,
    { variant: 'string', asChild: 'flag' },
    buttonClass ? { className: 'string' } : {},
  );
  if (!variants.includes(props.get('variant')?.value as string)) {
    fail('has a <Button> with another variant');
  }
  if (props.has('className') && props.get('className')?.value !== buttonClass) {
    fail('has a <Button> with another class');
  }
  const link = onlyPart(button, fail);
  if (!isNamed(link, 'a') && !isNamed(link, 'Link')) fail('has a <Button> without a link');
  const href = readProps(source, link, fail, { href: 'string' }).get('href')?.value as string;

  const [text, arrow, ...more] = parts(link);
  if (text?.type !== 'text' || more.length > 0) fail('has a <Button> with other content');
  if (!isNamed(arrow, 'ArrowRightIcon') || contentChildren(arrow).length > 0) {
    fail('has a <Button> without an arrow icon');
  }
  if (
    readProps(source, arrow, fail, { className: 'string' }).get('className')?.value !== arrowClass
  ) {
    fail('has an arrow icon with another class');
  }
  const label = String(text.value).trim();
  if (!textPattern.test(label) || label.includes('\n'))
    fail('has a <Button> label that is not text');
  return { label, href };
};

/** Returns the `actions` prop for a list of actions. */
const actionsProp = (actions: { label: string; href: string }[]) =>
  `actions={[${actions
    .map(({ label, href }) => `{ label: ${JSON.stringify(label)}, href: ${JSON.stringify(href)} }`)
    .join(', ')}]}`;

/** Returns the `title` prop for an element that holds only text. */
const titleProp = (source: string, node: MdNode, fail: Fail) => {
  readProps(source, node, fail, {});
  return `title="${plainSource(source, node, fail)}"`;
};

/** Returns the one-line source of a list item text. Calls `fail` on text over several lines. */
const lineSource = (source: string, node: MdNode, fail: Fail) => {
  const text = childrenSource(source, inlineContainer(node));
  if (text === '' || text.includes('\n')) fail(`<${node.name}> has text not on one line`);
  return text;
};

/** Rewrites a `CtaBox.Wrapper` to `FeatureCard` with title, text, a list and one action. */
const ctaBox = (source: string, node: MdNode, fail: Fail) => {
  const props = readProps(source, node, fail, {}, { variant: 'string', className: 'string' });
  if (props.has('variant') && !ctaBoxVariants.includes(props.get('variant')?.value as string)) {
    fail('has another variant');
  }
  if (props.has('className') && props.get('className')?.value !== ctaBoxClass) {
    fail('has another class');
  }
  const found = namedParts(
    node,
    ['CtaBox.Title', 'CtaBox.Description', 'CtaBox.List', 'CtaBox.Actions'],
    fail,
  );
  const get = (name: string) => found.get(name) ?? fail(`has no <${name}>`);
  const title = get('CtaBox.Title');
  const description = get('CtaBox.Description');
  const list = get('CtaBox.List');
  const actions = get('CtaBox.Actions');

  readProps(source, description, fail, {});
  readProps(source, list, fail, {});
  const items = parts(list).map((item) => {
    if (!isNamed(item, 'CtaBox.ListItem')) fail('has a <CtaBox.List> with other content');
    const itemTitle = readProps(source, item, fail, {}, { title: 'string' }).get('title');
    const text = lineSource(source, item, fail);
    if (!itemTitle) return `- ${text}`;
    const trimmed = stringValue(itemTitle, 'title', fail).trim();
    if (trimmed === '') fail('has a <CtaBox.ListItem> with an empty title');
    return `- **${trimmed}** ${text}`;
  });
  if (items.length === 0) fail('has an empty <CtaBox.List>');

  if (
    readProps(source, actions, fail, { className: 'string' }).get('className')?.value !==
    ctaActionsClass
  ) {
    fail('has a <CtaBox.Actions> with another class');
  }
  const action = buttonAction(
    source,
    onlyPart(actions, fail),
    fail,
    ['tertiary'],
    ctaButtonClass,
    ctaArrowClass,
  );

  return tag(
    'FeatureCard',
    [titleProp(source, title, fail), actionsProp([action])],
    [...bodyLines(source, description, fail), '', ...items],
  );
};

/** Rewrites an `ImageCard.Card` to `FeatureCard` with a side image, title, text and actions. */
const imageCard = (source: string, node: MdNode, fail: Fail) => {
  readProps(source, node, fail, {});
  const found = namedParts(node, ['ImageCard.Image', 'ImageCard.Content'], fail);
  const image = found.get('ImageCard.Image') ?? fail('has no <ImageCard.Image>');
  const content = found.get('ImageCard.Content') ?? fail('has no <ImageCard.Content>');
  const imageProps = readProps(source, image, fail, { src: 'expression', alt: 'string' });
  if (contentChildren(image).length > 0) fail('has an <ImageCard.Image> with children');

  readProps(source, content, fail, {});
  const contentParts = namedParts(content, ['ImageCard.Title', 'ImageCard.Paragraph', 'div'], fail);
  const title = contentParts.get('ImageCard.Title') ?? fail('has no <ImageCard.Title>');
  const paragraph = contentParts.get('ImageCard.Paragraph') ?? fail('has no <ImageCard.Paragraph>');
  const buttons = contentParts.get('div') ?? fail('has no buttons');
  readProps(source, paragraph, fail, {});
  if (
    readProps(source, buttons, fail, { className: 'string' }).get('className')?.value !==
    imageButtonsClass
  ) {
    fail('has a button box with another class');
  }
  const actions = parts(buttons).map((button) =>
    buttonAction(source, button, fail, imageButtonVariants, null, imageArrowClass),
  );
  if (actions.length === 0) fail('has no buttons');

  const src = imageProps.get('src') as Prop;
  const alt = imageProps.get('alt') as Prop;
  return tag(
    'FeatureCard',
    [
      `image${src.source.slice('src'.length)}`,
      `imageAlt${alt.source.slice('alt'.length)}`,
      'imagePosition="side"',
      titleProp(source, title, fail),
      actionsProp(actions),
    ],
    bodyLines(source, paragraph, fail),
  );
};

/**
 * Rewrites `Section` to a Markdown `##` heading with its description and `moreLink` around the
 * children. Keeps the children, so other steps rewrite them.
 */
export const sections: ShapeStep = {
  name: 'Section',
  keepsChildren: true,
  edits: ({ label, source, node }) => {
    if (node.name !== 'Section') return null;
    return section(source, node, (message) => {
      throw new Error(`${label}:${node.position?.start.line}: <Section> ${message}`);
    });
  },
};

/**
 * Rewrites `CtaBox.Wrapper` and `ImageCard.Card` to `FeatureCard`, with the `Button` links inside
 * them as actions. Copies titles, texts, `href`s and the image expression unchanged. Throws on a
 * part of these components outside them, on a `Button` that no earlier shape step rewrites, and on
 * any other shape.
 */
export const boxes: ShapeStep = {
  name: 'CtaBox and ImageCard',
  edits: ({ label, source, node }) => {
    const name = node.name ?? '';
    const line = node.position?.start.line;
    const fail: Fail = (message) => {
      throw new Error(`${label}:${line}: <${name}> ${message}`);
    };
    let lines: string[];
    if (name === 'CtaBox.Wrapper') lines = ctaBox(source, node, fail);
    else if (name === 'ImageCard.Card') lines = imageCard(source, node, fail);
    else if (partNames.includes(name)) return fail('is outside a CtaBox or ImageCard');
    else return null;

    const { start, end } = offsets(node);
    const indent = lineIndent(source, start) ?? fail('does not start a line');
    const text = lines.join(`\n${indent}`).replace(/\n[ \t]+\n/g, '\n\n');
    return [{ start, end, text }];
  },
};
