import type { ShapeStep } from '../component-mapping.ts';
import {
  childrenSource,
  contentChildren,
  isJsxElement,
  lineIndent,
  type MdNode,
  offsets,
  plainText,
} from '../mdast.ts';

/** Old card component names. Each is only allowed inside one of the card grids below. */
const cardComponents = [
  'CardGrid.Wrapper',
  'CardGrid.Item',
  'CardGrid.Subtitle',
  'CardGrid.ItemImage',
  'CardGrid.ItemImageIcon',
  'CardGrid.ItemTitle',
  'CardGrid.ItemParagraph',
  'CardGrid.ItemFooter',
  'Tag',
  'FilterGrid.Wrapper',
  'FilterGrid.Item',
  'Grid.Wrapper',
  'Grid.Item',
  'Grid.ItemHeader',
  'Grid.ItemContent',
  'Grid.ItemTitle',
  'Grid.ItemParagraph',
  'ProductCard',
];

/**
 * SVG files in `src/assets/images/` that draw with `currentColor`. As an `img` they are black, so
 * they get `dark:invert`.
 */
export const currentColorIcons = [
  'cloud',
  'dedicated-cloud',
  'self-hosted',
  'x',
  'discord',
  'github',
];

/** Returns the import path of a `currentColorIcons` file, as an `img` URL. */
export const currentColorIconImport = (name: string) => `@/assets/images/${name}.svg?url`;

/** True if `binding` is imported from a `currentColorIcons` file. */
const isCurrentColorIcon = (source: string, binding: string) =>
  currentColorIcons.some((name) =>
    source.split('\n').includes(`import ${binding} from '${currentColorIconImport(name)}'`),
  );

const cardGridClasses = ['sm:grid-cols-3', 'grid-cols-1 sm:grid-cols-3'];
const gridClass = 'sm:grid-cols-2 lg:grid-cols-3';
const productGridClass = 'grid sm:grid-cols-2 gap-5';
const iconTitleClass = 'text-[1.125rem]';

type Kind = 'string' | 'expression' | 'flag';
export type Fail = (message: string) => never;

/** The source of one prop, and its value when it is a string. */
export type Prop = { source: string; value: string | null };

/**
 * Returns the props of `node`. Calls `fail` on a spread prop, a missing required prop, a prop not
 * in `required` or `optional`, or a value of another kind.
 */
export const readProps = (
  source: string,
  node: MdNode,
  fail: Fail,
  required: Record<string, Kind>,
  optional: Record<string, Kind> = {},
) => {
  const props = new Map<string, Prop>();
  for (const attribute of node.attributes ?? []) {
    if (attribute.type !== 'mdxJsxAttribute') fail(`<${node.name}> has a spread prop`);
    const name = attribute.name as string;
    const kind = required[name] ?? optional[name] ?? fail(`<${node.name}> has the prop "${name}"`);
    const value = attribute.value;
    const actual =
      value === null || value === undefined
        ? 'flag'
        : typeof value === 'string'
          ? 'string'
          : 'expression';
    if (actual !== kind) fail(`<${node.name}> has a "${name}" value that is not a ${kind}`);
    const { start, end } = offsets(attribute);
    props.set(name, {
      source: source.slice(start, end),
      value: typeof value === 'string' ? value : null,
    });
  }
  for (const name of Object.keys(required)) {
    if (!props.has(name)) fail(`<${node.name}> has no "${name}" prop`);
  }
  return props;
};

/** Returns the prop source with the prop name replaced by `to`. */
const rename = (prop: Prop, from: string, to: string) => to + prop.source.slice(from.length);

/**
 * Returns `src={image}` for a `src={image.src}` prop. An `img` inside a prop renders as next/image,
 * which reads the size from the whole image import. Calls `fail` on another expression.
 */
const wholeImport = (src: Prop, fail: Fail) => {
  const match = /^src=\{([A-Za-z_$][\w$]*)\.src\}$/.exec(src.source);
  if (!match) fail('has an icon image whose "src" is not an image import with ".src"');
  return `src={${(match as RegExpExecArray)[1]}}`;
};

/** Returns the children, with paragraphs and prop-less `div`s replaced by their children. */
export const parts = (node: MdNode): MdNode[] =>
  contentChildren(node).flatMap((child) =>
    child.type === 'paragraph' ||
    (isJsxElement(child) && child.name === 'div' && (child.attributes ?? []).length === 0)
      ? parts(child)
      : [child],
  );

export const isNamed = (node: MdNode | undefined, name: string) =>
  node !== undefined && isJsxElement(node) && node.name === name;

/** Returns the only child of `node` after `parts`. Calls `fail` if it has another number. */
export const onlyPart = (node: MdNode, fail: Fail) => {
  const [child, ...rest] = parts(node);
  if (child === undefined || rest.length > 0) fail(`<${node.name}> has not exactly one child`);
  return child;
};

/** Returns the element children of `node`, keyed by name. Calls `fail` on anything else. */
export const namedParts = (node: MdNode, allowed: string[], fail: Fail) => {
  const result = new Map<string, MdNode>();
  for (const child of parts(node)) {
    const name = isJsxElement(child) ? (child.name ?? '') : '';
    if (!allowed.includes(name)) fail(`<${node.name}> has other content`);
    if (result.has(name)) fail(`<${node.name}> has more than one <${name}>`);
    result.set(name, child);
  }
  return result;
};

/** Returns the inline children of an element, with a single paragraph unwrapped. */
export const inlineContainer = (node: MdNode) => {
  const children = contentChildren(node);
  return children.length === 1 && children[0].type === 'paragraph' ? children[0] : node;
};

const plainTextPattern = /^[^"{}<>\n\\]+$/;

/** Returns the source of the text inside `node`. Calls `fail` unless it is plain one-line text. */
export const plainSource = (source: string, node: MdNode, fail: Fail) => {
  const container = inlineContainer(node);
  const text = childrenSource(source, container);
  if (!contentChildren(container).every((child) => child.type === 'text')) {
    fail(`<${node.name}> has content that is not plain text`);
  }
  if (!plainTextPattern.test(text)) fail(`<${node.name}> has text the script cannot copy`);
  return text;
};

/**
 * Returns the `title` prop for a title element: a string for plain text, JSX for text with `span`s
 * that have only a `className`. Calls `fail` on anything else.
 */
const titleProp = (source: string, node: MdNode, fail: Fail) => {
  const container = inlineContainer(node);
  const children = contentChildren(container);
  const isSpan = (child: MdNode) =>
    child.type === 'mdxJsxTextElement' &&
    child.name === 'span' &&
    child.attributes?.length === 1 &&
    child.attributes[0].name === 'className' &&
    typeof child.attributes[0].value === 'string' &&
    contentChildren(child).every((text) => text.type === 'text');
  if (children.length === 0 || !children.every((child) => child.type === 'text' || isSpan(child))) {
    fail(`<${node.name}> has a title with other content`);
  }
  if (children.every((child) => child.type === 'text')) {
    return `title="${plainSource(source, node, fail)}"`;
  }
  const text = childrenSource(source, container);
  if (text.includes('\n')) fail(`<${node.name}> has a title on more than one line`);
  return `title={<>${text}</>}`;
};

/**
 * Returns the text inside `node` as lines, with the indent of the first line removed from the
 * others. Calls `fail` if a line has less indent.
 */
export const bodyLines = (source: string, node: MdNode, fail: Fail) => {
  const container = inlineContainer(node);
  const text = childrenSource(source, container);
  const [first, ...rest] = text.split('\n');
  if (rest.length === 0) return [first];
  const indent =
    lineIndent(source, offsets(contentChildren(container)[0]).start) ??
    fail(`<${node.name}> has text the script cannot indent`);
  return [
    first,
    ...rest.map((line) =>
      line.startsWith(indent)
        ? line.slice(indent.length)
        : fail(`<${node.name}> has text the script cannot indent`),
    ),
  ];
};

/** Returns the lines of a tag with props and body lines. Long opening tags get a prop per line. */
export const tag = (name: string, props: string[], body: string[]) => {
  const selfClosing = body.length === 0;
  const oneLine = `<${name}${props.map((prop) => ` ${prop}`).join('')}${selfClosing ? ' />' : '>'}`;
  const open =
    oneLine.length <= 100
      ? [oneLine]
      : [`<${name}`, ...props.map((prop) => `  ${prop}`), selfClosing ? '/>' : '>'];
  return selfClosing ? open : [...open, ...body.map((line) => `  ${line}`), `</${name}>`];
};

/**
 * Returns the `href`, `target` and `rel` props of the link inside a linked card. The link is an `a`
 * or a `Link`, which the mapping turns into an `a`.
 */
const linkProps = (source: string, link: MdNode, fail: Fail) => {
  if (!isNamed(link, 'a') && !isNamed(link, 'Link')) fail('has a linked card without a link');
  const props = readProps(
    source,
    link,
    fail,
    { href: 'string' },
    { target: 'string', rel: 'string' },
  );
  return ['href', 'target', 'rel'].flatMap((name) => props.get(name)?.source ?? []);
};

/** Rewrites one `CardGrid.Item` to Fumadocs `Card` or `FeatureCard`. */
const cardGridItem = (source: string, item: MdNode, fail: Fail) => {
  if (!isNamed(item, 'CardGrid.Item')) fail('has a child that is not a <CardGrid.Item>');
  readProps(source, item, fail, { asChild: 'flag' });
  const link = onlyPart(item, fail);
  const href = linkProps(source, link, fail);
  const found = namedParts(
    link,
    [
      'CardGrid.Subtitle',
      'CardGrid.ItemImage',
      'CardGrid.ItemImageIcon',
      'CardGrid.ItemTitle',
      'CardGrid.ItemParagraph',
      'CardGrid.ItemFooter',
    ],
    fail,
  );
  const subtitle = found.get('CardGrid.Subtitle');
  const image = found.get('CardGrid.ItemImage');
  const imageIcon = found.get('CardGrid.ItemImageIcon');
  const title = found.get('CardGrid.ItemTitle') ?? fail('has a card without <CardGrid.ItemTitle>');
  const paragraph = found.get('CardGrid.ItemParagraph');
  const footer = found.get('CardGrid.ItemFooter');

  const titleClass = readProps(source, title, fail, {}, imageIcon ? { className: 'string' } : {});
  if (titleClass.has('className') && titleClass.get('className')?.value !== iconTitleClass) {
    fail('has a title with another class');
  }
  const titleSource = titleProp(source, title, fail);
  const body = paragraph ? bodyLines(source, paragraph, fail) : [];
  if (paragraph) readProps(source, paragraph, fail, {});

  const tags: string[] = [];
  if (footer) {
    readProps(source, footer, fail, {});
    for (const tagNode of parts(footer)) {
      if (!isNamed(tagNode, 'Tag')) fail('has a <CardGrid.ItemFooter> with other content');
      readProps(source, tagNode, fail, {});
      tags.push(plainText(tagNode).trim());
      plainSource(source, tagNode, fail);
    }
  }

  if (imageIcon) {
    if (subtitle || image || paragraph || footer) fail('has an icon card with other content');
    const src = readProps(source, imageIcon, fail, { src: 'expression', alt: 'string' }).get(
      'src',
    ) as Prop;
    return tag(
      'Card',
      [`icon={<img ${wholeImport(src, fail)} alt="" className="size-6" />}`, titleSource, ...href],
      [],
    );
  }
  if (!subtitle && !image && tags.length === 0) {
    return tag('Card', [titleSource, ...href], body);
  }

  const props: string[] = [...href];
  if (image) {
    const imageProps = readProps(source, image, fail, {
      asNextImage: 'flag',
      src: 'expression',
      width: 'expression',
      height: 'expression',
      alt: 'string',
    });
    props.push(
      rename(imageProps.get('src') as Prop, 'src', 'image'),
      rename(imageProps.get('alt') as Prop, 'alt', 'imageAlt'),
    );
  }
  if (subtitle) {
    if (readProps(source, subtitle, fail, { size: 'string' }).get('size')?.value !== 'sm') {
      fail('has a <CardGrid.Subtitle> with another size');
    }
    props.push(`label="${plainSource(source, subtitle, fail)}"`);
  }
  props.push(titleSource);
  if (tags.length > 0) props.push(`tags={${JSON.stringify(tags).replaceAll('","', '", "')}}`);
  return tag('FeatureCard', props, body);
};

/** Rewrites one `Grid.Item` to Fumadocs `Card`. Drops the arrow-only `Button` of linked items. */
const gridItem = (source: string, item: MdNode, fail: Fail) => {
  if (!isNamed(item, 'Grid.Item')) fail('has a child that is not a <Grid.Item>');
  const linked = readProps(source, item, fail, {}, { asChild: 'flag' }).has('asChild');
  let content = item;
  let href: string[] = [];
  if (linked) {
    content = onlyPart(item, fail);
    href = linkProps(source, content, fail);
  }
  const found = namedParts(
    content,
    linked
      ? ['Grid.ItemHeader', 'Grid.ItemContent', 'div']
      : ['Grid.ItemHeader', 'Grid.ItemContent'],
    fail,
  );
  const header = found.get('Grid.ItemHeader') ?? fail('has a <Grid.Item> without a header');
  const body = found.get('Grid.ItemContent') ?? fail('has a <Grid.Item> without content');

  const buttonBox = found.get('div');
  if (linked) {
    if (!buttonBox) fail('has a linked <Grid.Item> without a button');
    if (
      readProps(source, buttonBox as MdNode, fail, { className: 'string' }).get('className')
        ?.value !== 'mt-4'
    ) {
      fail('has a button box with another class');
    }
    const button = onlyPart(buttonBox as MdNode, fail);
    if (!isNamed(button, 'Button')) fail('has a button box without a <Button>');
    const buttonProps = readProps(source, button, fail, {
      className: 'string',
      size: 'string',
      variant: 'string',
    });
    if (
      buttonProps.get('className')?.value !== 'inline-block' ||
      buttonProps.get('size')?.value !== 'small' ||
      buttonProps.get('variant')?.value !== 'secondary'
    ) {
      fail('has a <Button> with other props');
    }
    const arrow = onlyPart(button, fail);
    if (!isNamed(arrow, 'ArrowRightIcon') || contentChildren(arrow).length > 0) {
      fail('has a <Button> with other content');
    }
    if (
      readProps(source, arrow, fail, { className: 'string' }).get('className')?.value !== 'w-4 h-4'
    ) {
      fail('has an arrow with another class');
    }
  }

  readProps(source, header, fail, {});
  const icon = onlyPart(header, fail);
  if (!isJsxElement(icon)) fail('has a <Grid.ItemHeader> without an element');
  let iconSource = source.slice(offsets(icon).start, offsets(icon).end);
  if (iconSource.includes('\n')) fail('has an icon on more than one line');
  const iconName = icon.name ?? '';
  if (iconName === 'img') {
    const iconProps = readProps(
      source,
      icon,
      fail,
      { src: 'expression' },
      { alt: 'string', 'aria-hidden': 'string', className: 'string' },
    );
    const src = iconProps.get('src') as Prop;
    const wholeSrc = wholeImport(src, fail);
    iconSource = iconSource.replace(src.source, wholeSrc);
    if (isCurrentColorIcon(source, wholeSrc.slice('src={'.length, -1))) {
      const className =
        iconProps.get('className') ?? fail('has a current-color icon without a class');
      iconSource = iconSource.replace(
        className.source,
        `className="${className.value} dark:invert"`,
      );
    }
  } else if (isCurrentColorIcon(source, iconName)) {
    const className = readProps(source, icon, fail, { className: 'string' }).get(
      'className',
    ) as Prop;
    if (contentChildren(icon).length > 0) fail(`has an icon <${iconName}> with children`);
    iconSource = `<img src={${iconName}} alt="" aria-hidden="true" className="${className.value} dark:invert" />`;
  }

  readProps(source, body, fail, {});
  const bodyParts = namedParts(body, ['Grid.ItemTitle', 'Grid.ItemParagraph'], fail);
  const title = bodyParts.get('Grid.ItemTitle') ?? fail('has a <Grid.Item> without a title');
  const paragraph =
    bodyParts.get('Grid.ItemParagraph') ?? fail('has a <Grid.Item> without a paragraph');
  readProps(source, title, fail, {});
  readProps(source, paragraph, fail, {});
  return tag(
    'Card',
    [`icon={${iconSource}}`, titleProp(source, title, fail), ...href],
    bodyLines(source, paragraph, fail),
  );
};

/** True if `text` shows as the same plain paragraph in MDX: no markup, no list or number start. */
export const isPlainParagraph = (text: string) =>
  /^[^{}<>*_`[\]\\\n#]+$/.test(text) && !/^[-+\d]/.test(text);

/** Rewrites one `ProductCard` to `FeatureCard` with actions. */
const productCard = (source: string, card: MdNode, fail: Fail) => {
  if (!isNamed(card, 'ProductCard')) fail('has a child that is not a <ProductCard>');
  const props = readProps(
    source,
    card,
    fail,
    {
      title: 'string',
      description: 'string',
      tags: 'expression',
      documentationUrl: 'string',
      icon: 'expression',
    },
    { secondaryUrl: 'string', secondaryButtonText: 'string' },
  );
  if (contentChildren(card).length > 0) fail('has a <ProductCard> with children');

  const tags = card.attributes?.find((attribute) => attribute.name === 'tags')?.value as MdNode;
  const program = tags.data?.estree as {
    body: { expression?: { type: string; elements: { type: string; value: unknown }[] } }[];
  };
  const array = program.body[0]?.expression;
  if (
    program.body.length !== 1 ||
    array?.type !== 'ArrayExpression' ||
    !array.elements.every(
      (element) => element.type === 'Literal' && typeof element.value === 'string',
    )
  ) {
    fail('has "tags" that are not a list of strings');
  }

  const description = props.get('description') as Prop;
  const text = description.source.slice('description="'.length, -1);
  if (!isPlainParagraph(text)) {
    fail('has a description the script cannot copy as text');
  }

  const actions = [{ label: 'Documentation', href: props.get('documentationUrl')?.value }];
  const secondaryUrl = props.get('secondaryUrl')?.value;
  if (secondaryUrl) {
    actions.push({
      label: props.get('secondaryButtonText')?.value ?? 'Example',
      href: secondaryUrl,
    });
  } else if (props.has('secondaryButtonText')) {
    fail('has "secondaryButtonText" without "secondaryUrl"');
  }
  const actionsSource = actions
    .map(({ label, href }) => `{ label: ${JSON.stringify(label)}, href: ${JSON.stringify(href)} }`)
    .join(', ');

  return tag(
    'FeatureCard',
    [
      (props.get('icon') as Prop).source,
      (props.get('title') as Prop).source,
      (props.get('tags') as Prop).source,
      `actions={[${actionsSource}]}`,
    ],
    [text],
  );
};

/** Rewrites one `FilterGrid.Item` holding one `CardGrid.Item` to `CardFilter.Item`. */
const filterItem = (source: string, item: MdNode, fail: Fail) => {
  if (!isNamed(item, 'FilterGrid.Item')) fail('has a child that is not a <FilterGrid.Item>');
  const filter = item.attributes?.[0];
  const kind = typeof filter?.value === 'string' ? 'string' : 'expression';
  const props = readProps(source, item, fail, { filter: kind });
  return tag(
    'CardFilter.Item',
    [(props.get('filter') as Prop).source],
    cardGridItem(source, onlyPart(item, fail), fail),
  );
};

/** URL keys of filters that share a page with another filter, by page and nearest heading above. */
const filterParams: Record<string, Record<string, string>> = {
  'examples/index.mdx': { Experiments: 'experiments' },
};

/** Returns the `param` of the `FilterGrid.Wrapper` at `node`, or null for the default key. */
const filterParam = (label: string, source: string, node: MdNode) => {
  const page = Object.keys(filterParams).find((path) => label.endsWith(`/${path}`));
  if (!page) return null;
  const headings = [...source.slice(0, offsets(node).start).matchAll(/^#{1,6} +(.+)$/gm)];
  const heading = headings.at(-1)?.[1].trim() ?? '';
  return filterParams[page][heading] ?? null;
};

/** Returns the lines of `Cards` holding the rewritten children of a grid. */
const cards = (grid: MdNode, rewrite: (child: MdNode) => string[]) => {
  const children = parts(grid);
  return tag('Cards', [], children.flatMap(rewrite));
};

/** Reads the `className` of a `CardGrid.Wrapper`. Calls `fail` on another class. */
const cardGridWrapper = (source: string, node: MdNode, fail: Fail) => {
  if (!isNamed(node, 'CardGrid.Wrapper')) fail('has a child that is not a <CardGrid.Wrapper>');
  const className = readProps(source, node, fail, {}, { className: 'string' }).get('className');
  if (className && !cardGridClasses.includes(className.value as string)) {
    fail('has a <CardGrid.Wrapper> with another class');
  }
};

/**
 * Rewrites the old card grids to Fumadocs `Cards`:
 * - `CardGrid.Wrapper`: each `CardGrid.Item` becomes `Card` (icon or title and text only) or
 *   `FeatureCard` (label, image or tags).
 * - `FilterGrid.Wrapper` around one `CardGrid.Wrapper`: becomes `CardFilter`, each
 *   `FilterGrid.Item` becomes `CardFilter.Item`.
 * - `Grid.Wrapper`: each `Grid.Item` becomes `Card`.
 * - A `div` grid of `ProductCard`s: each becomes `FeatureCard` with actions.
 *
 * Copies prop sources, titles and texts unchanged. Throws on an old card component outside these
 * grids, and on a grid or card of any other shape.
 */
export const cardGrids: ShapeStep = {
  name: 'card grids',
  edits: ({ label, source, node }) => {
    const name = node.name ?? '';
    const line = node.position?.start.line;
    const fail: Fail = (message) => {
      throw new Error(`${label}:${line}: card grid ${message}`);
    };
    const isProductGrid =
      name === 'div' &&
      node.attributes?.length === 1 &&
      node.attributes[0].name === 'className' &&
      node.attributes[0].value === productGridClass;

    let lines: string[];
    if (name === 'CardGrid.Wrapper') {
      cardGridWrapper(source, node, fail);
      lines = cards(node, (child) => cardGridItem(source, child, fail));
    } else if (name === 'FilterGrid.Wrapper') {
      const filters = readProps(source, node, fail, { filters: 'expression' }).get(
        'filters',
      ) as Prop;
      const grid = onlyPart(node, fail);
      cardGridWrapper(source, grid, fail);
      const param = filterParam(label, source, node);
      lines = tag(
        'CardFilter',
        [filters.source, ...(param ? [`param="${param}"`] : [])],
        cards(grid, (child) => filterItem(source, child, fail)),
      );
    } else if (name === 'Grid.Wrapper') {
      const className = readProps(source, node, fail, { className: 'string' }).get('className');
      if (className?.value !== gridClass) fail('has a <Grid.Wrapper> with another class');
      lines = cards(node, (child) => gridItem(source, child, fail));
    } else if (isProductGrid) {
      lines = cards(node, (child) => productCard(source, child, fail));
    } else if (cardComponents.includes(name)) {
      return fail(`has a <${name}> outside a card grid`);
    } else {
      return null;
    }

    const { start, end } = offsets(node);
    const indent = lineIndent(source, start) ?? fail('does not start a line');
    return [{ start, end, text: lines.join(`\n${indent}`) }];
  },
};
