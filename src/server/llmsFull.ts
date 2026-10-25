import { CATALOG_GROUPS } from '../content/catalog'
import { createCanonicalUrl } from './createCanonicalUrl'
import { DocsPage, fileForRoute, getDocsIndex } from './getDocsIndex'
import { fileToMarkdown } from './markdown/fileToMarkdown'
import { FULL_DOMAIN } from '@/utils/constants'

// The full text of the docs for agents, as one file and as one file per
// section, so an agent can load the part it needs. Deprecated pages stay out.

export type LlmsSection = { id: string; title: string; pages: DocsPage[] }

// The editor's catalog groups are small, so they share one file
const EDITOR_GROUPS = new Set(
  CATALOG_GROUPS.filter((group) => group.area === 'editor').map((group) => group.title),
)

function sectionTitle(page: DocsPage): string {
  const [top = 'More pages', second] = page.trail
  if (top !== 'Features') return top
  return !second || EDITOR_GROUPS.has(second) || second === 'All features'
    ? 'Editor features'
    : second
}

const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** The pages that go into the full text, current ones only. */
const currentPages = () => getDocsIndex().filter((page) => page.status !== 'Deprecated')

/** The sections, in sidebar order, each with its pages. */
export function getLlmsSections(): LlmsSection[] {
  const sections = new Map<string, LlmsSection>()
  for (const page of currentPages()) {
    const title = sectionTitle(page)
    const section = sections.get(title) ?? { id: slug(title), title, pages: [] }
    section.pages.push(page)
    sections.set(title, section)
  }
  return [...sections.values()]
}

export const sectionUrl = (id: string) => `${FULL_DOMAIN}/llms-full/${id}.txt`

const cache = new Map<string, string>()

async function pageMarkdown(page: DocsPage): Promise<string | null> {
  const cached = cache.get(page.route)
  if (cached !== undefined) return cached
  const file = fileForRoute(page.route)
  const markdown = file
    ? (await fileToMarkdown(file, createCanonicalUrl(page.route.split('/').filter(Boolean)))).trim()
    : null
  if (markdown) cache.set(page.route, markdown)
  return markdown
}

/** The Markdown of some pages, one after the other. */
export async function pagesMarkdown(pages: DocsPage[]): Promise<string> {
  const parts: string[] = []
  for (const page of pages) {
    const markdown = await pageMarkdown(page)
    if (markdown) parts.push(markdown)
  }
  return parts.join('\n\n')
}

/** Every current page. */
export const allPagesMarkdown = () => pagesMarkdown(currentPages())

/** About how many tokens a text is, at four characters a token. */
export const roughTokens = (text: string) => Math.round(text.length / 4000) * 1000
