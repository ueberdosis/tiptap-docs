import fs from 'fs/promises'
import frontMatter from 'front-matter'
import { transformMdxToMarkdown } from './transformMdx'

type Frontmatter = {
  title?: string
  description?: string
  meta?: { title?: string; description?: string }
}

/** Frontmatter descriptions may contain inline HTML; flatten to plain text. */
function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Read a content `.mdx` file and produce the markdown served to AI agents:
 * an H1 title + description from frontmatter, followed by the filtered body.
 */
export async function fileToMarkdown(filePath: string): Promise<string> {
  const raw = await fs.readFile(filePath, 'utf8')
  const { attributes, body } = frontMatter<Frontmatter>(raw)
  const transformed = await transformMdxToMarkdown(body)

  const title = attributes.title ?? attributes.meta?.title
  const description = attributes.description ?? attributes.meta?.description

  const parts: string[] = []
  if (title) parts.push(`# ${title}`)
  if (description) parts.push(stripHtml(description))
  parts.push(transformed)

  return `${parts.join('\n\n').trim()}\n`
}
