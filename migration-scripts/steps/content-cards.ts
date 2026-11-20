import type { ShapeStep } from '../component-mapping.ts';
import { contentChildren, lineIndent, offsets } from '../mdast.ts';
import { type Fail, isNamed, isPlainParagraph, type Prop, parts, readProps, tag } from './cards.ts';

const gridClass = 'grid sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 xl:gap-5';

/**
 * Rewrites a `div` grid of `ContentCard`s to Fumadocs `Cards`. Each `ContentCard` becomes a `Card`
 * with its `href`, its `icon` identifier as an element, its `title`, and its `description` as text.
 * Throws on a `ContentCard` outside such a grid, and on a grid or card of any other shape.
 */
export const contentCards: ShapeStep = {
  name: 'content cards',
  edits: ({ label, source, node }) => {
    const line = node.position?.start.line;
    const fail: Fail = (message) => {
      throw new Error(`${label}:${line}: content card grid ${message}`);
    };
    if (node.name === 'ContentCard') fail('has a <ContentCard> outside a grid');
    const children = parts(node);
    if (node.name !== 'div' || !children.some((child) => isNamed(child, 'ContentCard'))) {
      return null;
    }
    if (
      node.attributes?.length !== 1 ||
      node.attributes[0].name !== 'className' ||
      node.attributes[0].value !== gridClass
    ) {
      fail('has a <div> with other props');
    }

    const cards = children.flatMap((card) => {
      if (!isNamed(card, 'ContentCard')) fail('has a child that is not a <ContentCard>');
      if (contentChildren(card).length > 0) fail('has a <ContentCard> with children');
      const props = readProps(source, card, fail, {
        href: 'string',
        icon: 'expression',
        title: 'string',
        description: 'string',
      });
      const icon = /^icon=\{([A-Za-z_$][\w$]*)\}$/.exec((props.get('icon') as Prop).source);
      if (!icon) fail('has an "icon" that is not an identifier');
      const description = (props.get('description') as Prop).source.slice(
        'description="'.length,
        -1,
      );
      if (!isPlainParagraph(description)) fail('has a description the script cannot copy as text');
      return tag(
        'Card',
        [
          (props.get('href') as Prop).source,
          `icon={<${(icon as RegExpExecArray)[1]} />}`,
          (props.get('title') as Prop).source,
        ],
        [description],
      );
    });

    const { start, end } = offsets(node);
    const indent = lineIndent(source, start) ?? fail('does not start a line');
    return [{ start, end, text: tag('Cards', [], cards).join(`\n${indent}`) }];
  },
};
