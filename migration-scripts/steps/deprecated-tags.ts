import { isMap, isScalar, isSeq, parseDocument } from 'yaml';

/** Latest pages inside this folder of `src/content/` get the `deprecated` tag. */
const deprecatedFolder = 'ai/deprecated/';

/**
 * Returns the edit that adds `- type: deprecated` to the end of the frontmatter `tags` of a latest
 * `page` (path inside `src/content/`) in the deprecated folder. The frontmatter `yaml` starts at
 * `offset` in the page. Creates `tags` when it is missing. Returns null for other pages and for
 * pages that already have the tag. Throws when `tags` is not a block list.
 */
export const deprecatedTagEdit = (
  label: string,
  page: string,
  yaml: string,
  offset: number,
): [number, number, string] | null => {
  if (!page.startsWith(deprecatedFolder)) return null;
  const contents = parseDocument(yaml).contents;
  if (!isMap(contents)) throw new Error(`${label}: frontmatter is not a map`);
  const pair = contents.items.find((item) => isScalar(item.key) && item.key.value === 'tags');
  if (!pair) {
    const end = offset + yaml.length;
    const lineBreak = yaml.endsWith('\n') ? '' : '\n';
    return [end, end, `${lineBreak}tags:\n  - type: deprecated`];
  }
  const tags = pair.value;
  if (!isSeq(tags) || tags.flow || !tags.range || !tags.items.length) {
    throw new Error(`${label}: frontmatter tags is not a block list`);
  }
  const isDeprecated = (item: unknown) => {
    const type = isMap(item) ? item.get('type', true) : null;
    return isScalar(type) && type.value === 'deprecated';
  };
  if (tags.items.some(isDeprecated)) return null;
  const [start, end] = tags.range;
  const indent = start - (yaml.lastIndexOf('\n', start - 1) + 1);
  const item = `${' '.repeat(indent)}- type: deprecated`;
  // A block list's range ends after its line break, except as the last field of the frontmatter.
  const text = yaml[end - 1] === '\n' ? `${item}\n` : `\n${item}`;
  return [offset + end, offset + end, text];
};
