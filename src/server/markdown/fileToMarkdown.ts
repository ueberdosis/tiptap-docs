import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import frontMatter from 'front-matter'
import { transformMdxToMarkdown } from './transformMdx'

type Frontmatter = {
  title?: string
  description?: string
  meta?: { title?: string; description?: string }
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content')
const DATES_MANIFEST_PATH = path.join(
  process.cwd(),
  'src/server/markdown/contentDates.generated.json',
)

/**
 * Build-time git-date manifest (path-relative-to-content → YYYY-MM-DD), loaded
 * once. Absent in dev until `generate:content-dates` runs — `last_updated` is
 * simply omitted in that case.
 */
let contentDates: Record<string, string> | null = null
function getContentDates(): Record<string, string> {
  if (contentDates) return contentDates
  let loaded: Record<string, string>
  try {
    loaded = JSON.parse(fsSync.readFileSync(DATES_MANIFEST_PATH, 'utf8'))
  } catch {
    loaded = {}
  }
  contentDates = loaded
  return loaded
}

/** Frontmatter descriptions may contain inline HTML; flatten to plain text. */
function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Build the minimal YAML frontmatter block served atop every `.md` response. */
function buildFrontmatter(fields: {
  title?: string
  description?: string
  canonicalUrl?: string
  lastUpdated?: string
}): string {
  const lines: string[] = []
  // JSON.stringify yields a safely-quoted/escaped scalar (handles colons,
  // quotes, etc.) that is also valid YAML.
  if (fields.title) lines.push(`title: ${JSON.stringify(fields.title)}`)
  if (fields.description) lines.push(`description: ${JSON.stringify(fields.description)}`)
  if (fields.canonicalUrl) lines.push(`canonical_url: ${JSON.stringify(fields.canonicalUrl)}`)
  // Dates are bare YAML scalars (no quotes).
  if (fields.lastUpdated) lines.push(`last_updated: ${fields.lastUpdated}`)
  return `---\n${lines.join('\n')}\n---`
}

/**
 * Read a content `.mdx` file and produce the markdown served to AI agents: a
 * minimal frontmatter block (title, description, canonical_url, last_updated)
 * followed by an H1 title + description and the filtered body.
 */
export async function fileToMarkdown(filePath: string, canonicalUrl?: string): Promise<string> {
  const raw = await fs.readFile(filePath, 'utf8')
  const { attributes, body } = frontMatter<Frontmatter>(raw)
  const transformed = await transformMdxToMarkdown(body)

  const title = attributes.title ?? attributes.meta?.title
  const rawDescription = attributes.description ?? attributes.meta?.description
  const description = rawDescription ? stripHtml(rawDescription) : undefined

  const contentKey = path.relative(CONTENT_DIR, filePath).split(path.sep).join('/')
  const lastUpdated = getContentDates()[contentKey]

  const frontmatter = buildFrontmatter({ title, description, canonicalUrl, lastUpdated })

  const parts: string[] = [frontmatter]
  if (title) parts.push(`# ${title}`)
  if (description) parts.push(description)
  parts.push(transformed)

  return `${parts.join('\n\n').trim()}\n`
}
