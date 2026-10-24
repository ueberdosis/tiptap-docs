import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import frontMatter from 'front-matter'
import { formatDay, getLatestVersion, historyUrl, mainPackage } from '../changelogEntries'
import { cleanDescription, findDocsPage } from '../getDocsIndex'
import { transformMdxToMarkdown } from './transformMdx'
import { FULL_DOMAIN } from '@/utils/constants'

type Frontmatter = {
  title?: string
  description?: string
  intro?: string
  meta?: { title?: string; description?: string }
  headerDemo?: { path?: string; isPro?: boolean; src?: string; caption?: string }
  extension?: { name: string; package?: string }
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

// `import Name from './_partial.mdx'`: a shared MDX section that pages place with `<Name />`
const PARTIAL_IMPORT = /^import\s+(\w+)\s+from\s+['"]([^'"]*\/_[^/'"]+\.mdx)['"]/gm

/**
 * Put the content of imported partials where a page places them. The transform
 * drops components without children, so without this a page that consists of a
 * partial would be empty in Markdown.
 */
export async function inlinePartials(body: string, filePath: string, depth = 0): Promise<string> {
  if (depth > 3) return body
  let result = body
  for (const [, name, source] of body.matchAll(PARTIAL_IMPORT)) {
    const partialPath = path.resolve(path.dirname(filePath), source)
    // Its own imports would clash with the page's; the transform drops them anyway
    const partial = frontMatter(await fs.readFile(partialPath, 'utf8')).body.replace(
      /^import\s.*$/gm,
      '',
    )
    const content = await inlinePartials(partial, partialPath, depth + 1)
    result = result.replace(
      new RegExp(`<${name}(\\s[^>]*)?\\s*/>`, 'g'),
      () => `\n\n${content}\n\n`,
    )
  }
  return result
}

/** Build the minimal YAML frontmatter block served atop every `.md` response. */
export function buildFrontmatter(fields: {
  title?: string
  description?: string
  canonicalUrl?: string
  lastUpdated?: string
  /** Where the page sits in the sidebar, such as `Features › Review › Comments`. */
  section?: string
  plan?: string
  status?: string
  package?: string
}): string {
  const lines: string[] = []
  // JSON.stringify yields a safely-quoted/escaped scalar (handles colons,
  // quotes, etc.) that is also valid YAML.
  if (fields.title) lines.push(`title: ${JSON.stringify(fields.title)}`)
  if (fields.description) lines.push(`description: ${JSON.stringify(fields.description)}`)
  if (fields.canonicalUrl) lines.push(`canonical_url: ${JSON.stringify(fields.canonicalUrl)}`)
  if (fields.section) lines.push(`section: ${JSON.stringify(fields.section)}`)
  if (fields.plan) lines.push(`plan: ${JSON.stringify(fields.plan)}`)
  if (fields.status) lines.push(`status: ${JSON.stringify(fields.status)}`)
  if (fields.package) lines.push(`package: ${JSON.stringify(fields.package)}`)
  // Dates are bare YAML scalars (no quotes).
  if (fields.lastUpdated) lines.push(`last_updated: ${fields.lastUpdated}`)
  return `---\n${lines.join('\n')}\n---`
}

/**
 * Read a content `.mdx` file and produce the markdown served to AI agents: a
 * frontmatter block (title, description, canonical_url, section, plan, status, package,
 * last_updated)
 * followed by an H1 title + description and the filtered body.
 */
export async function fileToMarkdown(filePath: string, canonicalUrl?: string): Promise<string> {
  const raw = await fs.readFile(filePath, 'utf8')
  const { attributes, body } = frontMatter<Frontmatter>(raw)
  // A demo in the page header leads the body, as it does on the page
  const demo = attributes.headerDemo
  const headerDemo = demo
    ? `<CodeDemo${demo.isPro ? ' isPro' : ''} path=${JSON.stringify(demo.path ?? '')}${
        demo.src ? ` src=${JSON.stringify(demo.src)}` : ''
      }${demo.caption ? ` caption=${JSON.stringify(demo.caption)}` : ''} />\n\n`
    : ''
  const transformed = await transformMdxToMarkdown(
    headerDemo + (await inlinePartials(body, filePath)),
  )

  const title = attributes.title ?? attributes.meta?.title
  const rawDescription = attributes.description ?? attributes.meta?.description
  const description = rawDescription ? cleanDescription(rawDescription) : undefined

  const contentKey = path.relative(CONTENT_DIR, filePath).split(path.sep).join('/')
  const lastUpdated = getContentDates()[contentKey]

  const route = `/${contentKey.replace(/\.mdx$/, '').replace(/(^|\/)index$/, '')}`
  const page = findDocsPage(route)

  const frontmatter = buildFrontmatter({
    title,
    description,
    canonicalUrl,
    lastUpdated,
    section: page?.trail.length ? page.trail.join(' › ') : undefined,
    plan: page?.plan,
    status: page?.status,
    package: page?.package,
  })

  const parts: string[] = [frontmatter]
  if (title) parts.push(`# ${title}`)
  // The intro is what readers see under the title; the meta description only stands in for it
  const lead = attributes.intro ? cleanDescription(attributes.intro) : description
  if (lead) parts.push(lead)
  parts.push(transformed)

  // A feature page ends with its latest version, as on the page
  const main = attributes.extension && mainPackage(attributes.extension)
  const latest = main ? getLatestVersion(main) : undefined
  if (latest) {
    const version = latest.date
      ? `Latest version ${latest.version} (${formatDay(latest.date)}). `
      : ''
    parts.push(`${version}[What changed](${FULL_DOMAIN}${historyUrl(latest.slug)}.md)`)
  }

  return `${parts.join('\n\n').trim()}\n`
}
