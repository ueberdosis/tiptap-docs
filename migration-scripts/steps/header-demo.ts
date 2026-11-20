import { isMap, isScalar, parseDocument } from 'yaml';

/** Tags allowed in a `headerDemo.caption`, with their allowed attributes. */
const captionTags: Record<string, string[]> = { strong: [], em: [], code: [], a: ['href'] };

/** A string prop value in double quotes. Throws on a value that needs escaping. */
const quoted = (label: string, field: string, value: unknown) => {
  if (typeof value !== 'string' || /["\n]/.test(value)) {
    throw new Error(`${label}: headerDemo.${field} must be a one-line string without quotes`);
  }
  return `"${value}"`;
};

/** A boolean prop: `name` for true, `name={false}` for false. */
const flag = (label: string, field: string, value: unknown) => {
  if (typeof value !== 'boolean')
    throw new Error(`${label}: headerDemo.${field} must be a boolean`);
  return value ? field : `${field}={false}`;
};

/**
 * Turns caption HTML into a JSX fragment. Allows only `strong`, `em`, `code` and `a href`.
 * Throws on any other tag or attribute, unbalanced tags, or text with `{`, `}`, `<` or `>`.
 */
export const captionJsx = (label: string, html: string) => {
  const fail = (message: string): never => {
    throw new Error(`${label}: headerDemo.caption ${message}`);
  };
  const open: string[] = [];
  let output = '';
  let rest = html;
  while (rest) {
    const match = /^<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s=>]+="[^"]*")*)\s*>/.exec(rest);
    if (match) {
      const [whole, closing, name, attributes] = match;
      const allowed = captionTags[name] ?? fail(`has a tag that is not allowed: <${name}>`);
      if (closing) {
        if (attributes || open.pop() !== name) fail(`has an unbalanced </${name}>`);
      } else {
        for (const [, attribute] of attributes.matchAll(/([^\s=]+)="[^"]*"/g)) {
          if (!allowed.includes(attribute)) {
            fail(`has an attribute that is not allowed: <${name} ${attribute}>`);
          }
        }
        open.push(name);
      }
      output += whole;
      rest = rest.slice(whole.length);
      continue;
    }
    const text = /^[^<]+/.exec(rest)?.[0] ?? fail(`has a tag it cannot read: "${rest}"`);
    if (/[{}>]/.test(text)) fail(`has text with "{", "}" or ">": "${text}"`);
    output += text;
    rest = rest.slice(text.length);
  }
  if (open.length) fail(`has an unclosed <${open.at(-1)}>`);
  return `{<>${output}</>}`;
};

/**
 * Moves the frontmatter field `headerDemo` into the page body. `yaml` is the frontmatter text, which
 * starts at `yamlOffset` in the page. `bodyStart` is the offset right after the frontmatter.
 * Returns two edits: one removes the field, one inserts
 * `<HeaderDemo viewer view="preview" isLarge … />` as the first element of the body.
 * Returns an empty list when the page has no `headerDemo`. Throws on an unknown field.
 */
export const headerDemoEdits = (
  label: string,
  yaml: string,
  yamlOffset: number,
  bodyStart: number,
): [number, number, string?][] => {
  const contents = parseDocument(yaml).contents;
  const pair = isMap(contents)
    ? contents.items.find((item) => isScalar(item.key) && item.key.value === 'headerDemo')
    : undefined;
  if (!pair) return [];
  const value = pair.value;
  if (!isScalar(pair.key) || !isMap(value) || !pair.key.range || !value.range) {
    throw new Error(`${label}: headerDemo is not a map`);
  }
  const fields = value.toJSON() as Record<string, unknown>;
  const props: Record<string, (value: unknown) => string> = {
    path: (v) => `path=${quoted(label, 'path', v)}`,
    isPro: (v) => flag(label, 'isPro', v),
    src: (v) => `src=${quoted(label, 'src', v)}`,
    code: (v) => flag(label, 'code', v),
    height: (v) => `height=${quoted(label, 'height', v)}`,
    caption: (v) => {
      if (typeof v !== 'string' || v.includes('\n')) {
        throw new Error(`${label}: headerDemo.caption must be a one-line string`);
      }
      return `caption=${captionJsx(label, v)}`;
    },
  };
  for (const field of Object.keys(fields)) {
    if (!(field in props)) throw new Error(`${label}: unknown headerDemo field "${field}"`);
  }
  const attributes = Object.entries(props)
    .filter(([field]) => field in fields)
    .map(([field, toProp]) => ` ${toProp(fields[field])}`)
    .join('');
  return [
    [yamlOffset + pair.key.range[0], yamlOffset + value.range[1]],
    [bodyStart, bodyStart, `\n<HeaderDemo viewer view="preview" isLarge${attributes} />\n`],
  ];
};
