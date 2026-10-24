import { CHANGELOG_HIGHLIGHTS } from '@/content/resources/changelog-highlights'
import { getReleaseTimeline } from '@/server/changelogEntries'
import { FULL_DOMAIN } from '@/utils/constants'

// The changelog as an RSS feed: the highlights and every release with a known
// day, newest first. Built with the site.

export const dynamic = 'force-static'

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const absolute = (url: string) => (url.startsWith('http') ? url : `${FULL_DOMAIN}${url}`)

type FeedItem = { title: string; link: string; date: string; description: string; guid: string }

export function GET() {
  const changelog = `${FULL_DOMAIN}/resources/changelog`
  const items: FeedItem[] = [
    ...CHANGELOG_HIGHLIGHTS.map((highlight) => ({
      title: `${highlight.type}: ${highlight.title}`,
      link: absolute(highlight.url),
      date: highlight.date,
      description: `${highlight.text} (${highlight.feature} ${highlight.version})`,
      guid: `highlight-${highlight.feature}-${highlight.version}`,
    })),
    ...getReleaseTimeline()
      .filter((release) => release.date)
      .map((release) => ({
        title: release.title,
        link: `${changelog}#${release.id}`,
        date: release.date!,
        description: release.entries
          .map((entry) => `${entry.type}: ${entry.feature.name}: ${entry.text}`)
          .join('\n'),
        guid: `release-${release.id}`,
      })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>Tiptap changelog</title>
<link>${changelog}</link>
<description>New features, breaking changes, and fixes in Tiptap.</description>
${items
  .map(
    (item) => `<item>
<title>${escape(item.title)}</title>
<link>${escape(item.link)}</link>
<guid isPermaLink="false">${escape(item.guid)}</guid>
<pubDate>${new Date(`${item.date}T00:00:00Z`).toUTCString()}</pubDate>
<description>${escape(item.description)}</description>
</item>`,
  )
  .join('\n')}
</channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
