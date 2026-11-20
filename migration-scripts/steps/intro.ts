import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { isMap, isScalar, parseDocument } from 'yaml';

/** Tags allowed in an `intro`, with their allowed attributes. */
const introTags: Record<string, string[]> = { code: [], strong: [], a: ['href'] };

/** Escapes the characters that Markdown or MDX would read as syntax. */
const escapeText = (text: string) => text.replace(/[\\`*_{}[\]<>|~]/g, '\\$&');

/**
 * Turns intro HTML into one line of Markdown. Allows only `code`, `strong` and `a href`.
 * Throws on any other tag or attribute, a tag inside `code`, an HTML entity, unbalanced tags,
 * or a result that does not parse as a single MDX paragraph.
 */
export const introMarkdown = (label: string, html: string) => {
  const fail = (message: string): never => {
    throw new Error(`${label}: intro ${message}`);
  };
  if (/[\r\n]/.test(html)) fail('has a line break');
  const entity = /&[#\w]*;?/.exec(html);
  if (entity) fail(`has an HTML entity: ${entity[0]}`);

  /** Open tags: name and the Markdown written for it so far. */
  const stack: { name: string; href?: string; output: string }[] = [{ name: '', output: '' }];
  let rest = html;
  while (rest) {
    const match = /^<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s=>]+="[^"]*")*)\s*>/.exec(rest);
    if (match) {
      const [whole, closing, name, attributes] = match;
      const allowed = introTags[name] ?? fail(`has a tag that is not allowed: <${name}>`);
      const top = stack.at(-1) as (typeof stack)[number];
      if (closing) {
        if (attributes || top.name !== name) fail(`has an unbalanced </${name}>`);
        stack.pop();
        const parent = stack.at(-1) as (typeof stack)[number];
        if (name === 'code') {
          if (top.output.includes('`')) fail(`has a backtick inside <code>`);
          parent.output += `\`${top.output}\``;
        }
        if (name === 'strong') parent.output += `**${top.output}**`;
        if (name === 'a') parent.output += `[${top.output}](${top.href})`;
      } else {
        if (top.name === 'code') fail(`has a tag inside <code>: <${name}>`);
        const values: Record<string, string> = {};
        for (const [, attribute, value] of attributes.matchAll(/([^\s=]+)="([^"]*)"/g)) {
          if (!allowed.includes(attribute)) {
            fail(`has an attribute that is not allowed: <${name} ${attribute}>`);
          }
          values[attribute] = value;
        }
        if (name === 'a') {
          const href = values.href ?? fail('has an <a> without href');
          if (!href || /[\s()<>]/.test(href)) fail(`has an href it cannot write: "${href}"`);
          stack.push({ name, href, output: '' });
        } else {
          stack.push({ name, output: '' });
        }
      }
      rest = rest.slice(whole.length);
      continue;
    }
    const text = /^[^<]+/.exec(rest)?.[0] ?? fail(`has a tag it cannot read: "${rest}"`);
    const top = stack.at(-1) as (typeof stack)[number];
    top.output += top.name === 'code' ? text : escapeText(text);
    rest = rest.slice(text.length);
  }
  if (stack.length > 1) fail(`has an unclosed <${stack.at(-1)?.name}>`);
  const markdown = stack[0].output.trim();

  const tree = remark().use(remarkMdx).parse(markdown);
  if (tree.children.length !== 1 || tree.children[0].type !== 'paragraph') {
    fail(`does not become a single paragraph: "${markdown}"`);
  }
  return markdown;
};

/**
 * Moves the frontmatter field `intro` into the page body. `yaml` is the frontmatter text, which
 * starts at `yamlOffset` in the page. `bodyStart` is the offset right after the frontmatter.
 * Returns two edits: one removes the field, one inserts the intro as a Markdown paragraph at
 * the start of the body. Returns an empty list when the page has no `intro`.
 */
export const introEdits = (
  label: string,
  yaml: string,
  yamlOffset: number,
  bodyStart: number,
): [number, number, string?][] => {
  const contents = parseDocument(yaml).contents;
  const pair = isMap(contents)
    ? contents.items.find((item) => isScalar(item.key) && item.key.value === 'intro')
    : undefined;
  if (!pair) return [];
  const value = pair.value;
  if (
    !isScalar(pair.key) ||
    !isScalar(value) ||
    typeof value.value !== 'string' ||
    !pair.key.range ||
    !value.range
  ) {
    throw new Error(`${label}: intro is not a string`);
  }
  return [
    [yamlOffset + pair.key.range[0], yamlOffset + value.range[1]],
    [bodyStart, bodyStart, `\n${introMarkdown(label, value.value)}\n`],
  ];
};
