import { buildLlmsTxt } from '@/server/llmsText'

// Reads the content directory once at build time; the output never varies per request.
export const runtime = 'nodejs'
export const dynamic = 'force-static'

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
