import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import type { ShapeStep } from '../component-mapping.ts';
import {
  childrenSource,
  contentChildren,
  hasProps,
  lineIndent,
  offsets,
  reindent,
  stringProps,
} from '../mdast.ts';

const linkClass = 'flex items-center justify-center gap-2';
const variants = { primary: 'primary', secondary: 'secondary' } as const;

/**
 * Rewrites a full-screen button (a `Button` whose only child is a `Link` with the full-screen
 * class) to one `a` with the Fumadocs button style and `not-prose`. Copies the label and an optional
 * `ArrowRightIcon` unchanged. Returns null for a `Button` of any other shape. Throws on a
 * full-screen button with other props, variants or content.
 */
export const fullScreenButtons: ShapeStep = {
  name: 'full-screen Button',
  edits: ({ label, source, node }) => {
    const [link, ...rest] = contentChildren(node);
    if (node.name !== 'Button' || rest.length > 0 || link?.name !== 'Link') return null;
    const linkProps = stringProps(link);
    if (linkProps?.get('className') !== linkClass) return null;

    const fail = (message: string): never => {
      throw new Error(`${label}: full-screen <Button> ${message}`);
    };
    const variant = stringProps(node)?.get('variant') as keyof typeof variants;
    if (!(variant in variants) || !hasProps(node, { variant, size: 'medium' })) {
      fail('has other props');
    }
    const href =
      link.attributes?.find((attribute) => attribute.name === 'href') ??
      fail('has a <Link> without href');
    if (linkProps.size !== 2) fail('has a <Link> with other props');

    const [text, icon, ...more] = contentChildren(link);
    const textOnly = text?.type === 'paragraph' && text.children?.every((c) => c.type === 'text');
    const iconOk =
      icon === undefined ||
      (icon.name === 'ArrowRightIcon' &&
        hasProps(icon, { className: 'size-3.5' }) &&
        contentChildren(icon).length === 0);
    if (!textOnly || !iconOk || more.length > 0) fail('has other content');

    const { start, end } = offsets(node);
    const indent = lineIndent(source, start) ?? fail('does not start a line');
    const contentIndent = lineIndent(source, offsets(text).start) ?? fail('has other content');
    // `not-prose` removes the margins of the paragraph MDX makes from the label line.
    const className = `${buttonVariants({ variant: variants[variant] })} gap-2 not-prose`;
    const hrefSource = source.slice(offsets(href).start, offsets(href).end);
    const content = reindent(childrenSource(source, link), contentIndent, `${indent}  `);
    return [
      {
        start,
        end,
        text: [
          `<a ${hrefSource} className="${className}">`,
          `${indent}  ${content}`,
          `${indent}</a>`,
        ].join('\n'),
      },
    ];
  },
};
