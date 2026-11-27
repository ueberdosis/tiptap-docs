import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { docsRoute, siteUrl } from '@/lib/shared';

type Node = {
  type: string;
  url?: string;
  position?: { start: { offset?: number }; end: { offset?: number } };
  children?: Node[];
};

const parser = remark().use(remarkGfm);

/**
 * The absolute `.md` URL of a docs page link (`/docs` or `/docs/…`), with its `?query` and
 * `#fragment` kept after `.md`. `undefined` for any other link, and for a path with a file
 * extension.
 */
function markdownPageUrl(url: string) {
  const [, path, rest] = /^([^?#]*)(.*)$/s.exec(url) ?? [];
  if (path !== docsRoute && !path.startsWith(`${docsRoute}/`)) return undefined;
  if (/\.[a-z0-9]+$/i.test(path)) return undefined;
  return `${siteUrl}${path}.md${rest}`;
}

/**
 * Rewrites the docs page links of a Markdown text to absolute `.md` URLs on the production site,
 * for example `/docs/editor/api/commands#chain` to
 * `https://tiptap.dev/docs/editor/api/commands.md#chain`. Reads inline links, reference
 * definitions and `href="…"` in HTML tags. Changes only the link target; the rest of the text stays
 * byte for byte the same. Throws if it can not find the target of such a link in the text.
 */
export function absoluteMarkdownLinks(markdown: string) {
  const edits: { start: number; end: number; text: string }[] = [];

  const visit = (node: Node) => {
    if (node.type === 'html') {
      const start = node.position?.start.offset;
      const end = node.position?.end.offset;
      if (start !== undefined && end !== undefined) {
        for (const match of markdown.slice(start, end).matchAll(/\bhref="([^"]*)"/g)) {
          const target = markdownPageUrl(match[1]);
          if (!target) continue;
          const index = start + (match.index ?? 0) + match[0].indexOf('"') + 1;
          edits.push({ start: index, end: index + match[1].length, text: target });
        }
      }
    }
    if ((node.type === 'link' || node.type === 'definition') && node.url) {
      const target = markdownPageUrl(node.url);
      const start = node.position?.start.offset;
      const end = node.position?.end.offset;
      if (target && start !== undefined && end !== undefined) {
        const source = markdown.slice(start, end);
        const marker = node.type === 'link' ? '](' : ']:';
        const before = node.type === 'link' ? source.lastIndexOf(marker) : source.indexOf(marker);
        const index = before < 0 ? -1 : source.indexOf(node.url, before + marker.length);
        if (index < 0) throw new Error(`Can not find the target of the link ${source}`);
        edits.push({ start: start + index, end: start + index + node.url.length, text: target });
      }
    }
    node.children?.forEach(visit);
  };
  visit(parser.parse(markdown) as Node);

  let output = markdown;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }
  return output;
}
