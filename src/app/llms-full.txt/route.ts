import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { fileForRoute, getDocsIndex } from '@/server/getDocsIndex'
import { DOCS_SUMMARY, usageNotes } from '@/server/llmsText'
import { changelogToMarkdown } from '@/server/markdown/changelogToMarkdown'
import { fileToMarkdown } from '@/server/markdown/fileToMarkdown'

// Every page's Markdown in one file, in sidebar order. Built once at build time.
export const runtime = 'nodejs'
export const dynamic = 'force-static'

const CHANGELOG_PREFIX = '/resources/changelog/'

async function pageMarkdown(route: string): Promise<string | null> {
  const canonical = createCanonicalUrl(route.split('/').filter(Boolean))
  if (route.startsWith(CHANGELOG_PREFIX)) {
    return changelogToMarkdown(route.slice(CHANGELOG_PREFIX.length), canonical)
  }
  const file = fileForRoute(route)
  return file ? fileToMarkdown(file, canonical) : null
}

export async function GET() {
  const pages: string[] = []
  for (const page of getDocsIndex()) {
    const markdown = await pageMarkdown(page.route)
    if (markdown) pages.push(markdown.trim())
  }

  const header = ['# Tiptap Documentation', '', `> ${DOCS_SUMMARY}`, '', ...usageNotes()].join('\n')
  return new Response(`${[header, ...pages].join('\n\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
