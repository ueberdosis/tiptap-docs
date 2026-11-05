import { getLlmsSections, pagesMarkdown } from '@/server/llmsFull'
import { DOCS_SUMMARY } from '@/server/llmsText'

// The full text of one section, such as /llms-full/comments.txt

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return getLlmsSections().map(({ id }) => ({ section: `${id}.txt` }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section: file } = await params
  const section = getLlmsSections().find(({ id }) => `${id}.txt` === file)
  if (!section) return new Response('Not found', { status: 404 })
  const header = `# Tiptap Documentation: ${section.title}\n\n> ${DOCS_SUMMARY}`
  return new Response(`${header}\n\n${await pagesMarkdown(section.pages)}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
