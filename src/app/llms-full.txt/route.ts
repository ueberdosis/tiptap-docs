import { allPagesMarkdown } from '@/server/llmsFull'
import { DOCS_SUMMARY, usageNotes } from '@/server/llmsText'

// Every current page's Markdown in one file, in sidebar order. Built once at
// build time. The files per section in /llms-full/ are smaller.
export const runtime = 'nodejs'
export const dynamic = 'force-static'

export async function GET() {
  const header = ['# Tiptap Documentation', '', `> ${DOCS_SUMMARY}`, '', ...usageNotes()].join('\n')
  return new Response(`${header}\n\n${await allPagesMarkdown()}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
