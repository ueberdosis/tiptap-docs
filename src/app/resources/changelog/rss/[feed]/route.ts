import { groupFeed, groupFeeds } from '@/server/changelogFeed'

// One RSS feed per feature group, such as /resources/changelog/rss/tables.xml

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return groupFeeds().map(({ id }) => ({ feed: `${id}.xml` }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params
  const xml = groupFeed(feed.replace(/\.xml$/, ''))
  if (!xml) return new Response('Not found', { status: 404 })
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
