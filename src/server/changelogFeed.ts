import { CATALOG_GROUPS } from '@/content/catalog'
import { CHANGELOG_HIGHLIGHTS } from '@/content/resources/changelog-highlights'
import { getReleaseTimeline } from '@/server/changelogEntries'
import { FULL_DOMAIN } from '@/utils/constants'

// RSS feeds of the changelog: one for everything, and one per feature group
// for readers who follow only tables or AI, say.

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const absolute = (url: string) => (url.startsWith('http') ? url : `${FULL_DOMAIN}${url}`)

const CHANGELOG = `${FULL_DOMAIN}/resources/changelog`

/** How many open source releases a feed reaches back. */
const RELEASES = 20

type FeedItem = { title: string; link: string; date: string; description: string; guid: string }

function toXml(title: string, description: string, items: FeedItem[]): string {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date))
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escape(title)}</title>
<link>${CHANGELOG}</link>
<description>${escape(description)}</description>
${sorted
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
}

/** Dated releases, keeping only the changes `keep` accepts; releases left empty drop out. */
function releaseItems(keep: (group?: string) => boolean): FeedItem[] {
  return getReleaseTimeline(RELEASES).flatMap((release) => {
    const entries = release.entries.filter((entry) => keep(entry.feature.group))
    if (!release.date || !entries.length) return []
    return [
      {
        title: release.title,
        link: `${CHANGELOG}#${release.id}`,
        date: release.date,
        description: entries
          .map((entry) => `${entry.type}: ${entry.feature.name}: ${entry.text}`)
          .join('\n'),
        guid: `release-${release.id}`,
      },
    ]
  })
}

/** Everything: the highlights and every dated release. */
export function changelogFeed(): string {
  const highlights = CHANGELOG_HIGHLIGHTS.map((highlight) => ({
    title: `${highlight.type}: ${highlight.title}`,
    link: absolute(highlight.url),
    date: highlight.date,
    description: `${highlight.text} (${highlight.feature} ${highlight.version})`,
    guid: `highlight-${highlight.feature}-${highlight.version}`,
  }))
  return toXml('Tiptap changelog', 'New features, breaking changes, and fixes in Tiptap.', [
    ...highlights,
    ...releaseItems(() => true),
  ])
}

/** The feature groups that have changes, each with the path of its feed. */
export function groupFeeds(): Array<{ id: string; title: string; href: string }> {
  const groups = new Set(
    getReleaseTimeline(RELEASES).flatMap((release) =>
      release.entries.map((entry) => entry.feature.group),
    ),
  )
  return CATALOG_GROUPS.filter((group) => groups.has(group.id)).map((group) => ({
    id: group.id,
    title: group.title,
    href: ['/resources/changelog/rss', `${group.id}.xml`].join('/'),
  }))
}

/** The changes of one feature group, or undefined for a group without any. */
export function groupFeed(id: string): string | undefined {
  const group = CATALOG_GROUPS.find((candidate) => candidate.id === id)
  if (!group) return undefined
  return toXml(
    `Tiptap changelog: ${group.title}`,
    `New features, breaking changes, and fixes in Tiptap ${group.title}.`,
    releaseItems((entryGroup) => entryGroup === id),
  )
}
