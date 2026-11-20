/**
 * Stand-in for the `front-matter` package, which the source sidebar code imports and this app does
 * not have. Same call shape: `frontMatter(text).attributes` and `frontMatter.test(text)`.
 * Parses the YAML with the `yaml` package.
 */
import { parse } from 'yaml';

const block = /^\ufeff?(= yaml =|---)$([\s\S]*?)^(?:\1|\.\.\.)\s*$(?:\r?\n)?/m;

function frontMatter(text: string) {
  const match = block.exec(text);
  if (match?.index !== 0) return { attributes: {}, body: text, frontmatter: undefined };
  return {
    attributes: parse(match[2]) ?? {},
    body: text.slice(match[0].length),
    frontmatter: match[2].trim(),
  };
}

frontMatter.test = (text: string) => {
  const match = block.exec(text);
  return !!match && match.index === 0;
};

export default frontMatter;
