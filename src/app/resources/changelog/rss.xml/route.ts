import { changelogFeed } from '@/server/changelogFeed'

// The changelog as an RSS feed, built with the site

export const dynamic = 'force-static'

export function GET() {
  return new Response(changelogFeed(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
