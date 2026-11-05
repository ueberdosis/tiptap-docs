import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

// Changelog entries number in the thousands and are short, so they get one
// shared pipeline without syntax highlighting, and each text renders once.

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .freeze()

const cache = new Map<string, string>()

/** A changelog entry's Markdown as HTML. */
export function renderChangelogMarkdown(markdown: string): string {
  let html = cache.get(markdown)
  if (html === undefined) {
    html = String(processor.processSync(markdown))
    cache.set(markdown, html)
  }
  return html
}
