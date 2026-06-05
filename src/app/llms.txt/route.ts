import fs from 'fs/promises'
import path from 'path'
import glob from 'fast-glob'
import frontMatter from 'front-matter'
import { FULL_DOMAIN } from '@/utils/constants'

// Reads the content directory once at build time; the output never varies per request.
export const runtime = 'nodejs'
export const dynamic = 'force-static'

type Frontmatter = {
  title?: string
  description?: string
  meta?: { title?: string; description?: string }
}

/** src/content path → public route, e.g. `editor/index.mdx` → `/editor`. */
function fileToRoute(file: string): string {
  const p = file.replace(/\.mdx$/, '').replace(/\/index$/, '').replace(/^index$/, '')
  return p ? `/${p}` : '/'
}

/** The `.md` URL an agent can fetch for a given route. */
function markdownUrl(route: string): string {
  return `${FULL_DOMAIN}${route === '/' ? '/index' : route}.md`
}

function stripHtml(value?: string): string {
  return value
    ? value
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : ''
}

function sectionTitle(section: string): string {
  return section
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function GET() {
  const files = await glob('**/*.mdx', { cwd: 'src/content' })

  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(process.cwd(), 'src/content', file), 'utf8')
      const { attributes } = frontMatter<Frontmatter>(raw)
      const route = fileToRoute(file)
      return {
        route,
        section: file.split('/')[0].replace(/\.mdx$/, ''),
        title: attributes.title ?? attributes.meta?.title ?? route,
        description: stripHtml(attributes.description ?? attributes.meta?.description),
      }
    }),
  )

  const bySection = new Map<string, typeof entries>()
  for (const entry of entries) {
    const list = bySection.get(entry.section) ?? []
    list.push(entry)
    bySection.set(entry.section, list)
  }

  const lines: string[] = [
    '# Tiptap Documentation',
    '',
    '> Tiptap is the headless and extensible rich-text editor framework tailored to modern web and app development needs.',
    '',
    'Every page is available as Markdown: append `.md` to any documentation URL,' +
      ' or send an `Accept: text/markdown` header.',
    '',
    'For a product overview and curated entry points, see https://tiptap.dev/llms.txt',
    ''
  ]

  for (const [section, items] of [...bySection.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`## ${sectionTitle(section)}`, '')
    for (const item of items.sort((a, b) => a.route.localeCompare(b.route))) {
      const suffix = item.description ? `: ${item.description}` : ''
      lines.push(`- [${item.title}](${markdownUrl(item.route)})${suffix}`)
    }
    lines.push('')
  }

  return new Response(lines.join('\n').trim() + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
