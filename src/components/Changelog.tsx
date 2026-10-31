import { RssIcon } from 'lucide-react'
import Link from '@/components/Link'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { CHANGELOG_HIGHLIGHTS } from '@/content/resources/changelog-highlights'
import {
  ChangelogPackagesFiltered,
  ChangelogReleasesFiltered,
} from '@/components/ChangelogFilters.client'
import { ReleaseTimeline, TimelineRelease } from '@/components/ReleaseTimeline'
import {
  TimelineItem,
  formatDay,
  getLatestVersion,
  getOlderOpenSourceReleases,
  getPackageHistories,
  getPackageTimeline,
  getReleaseTimeline,
  historyUrl,
  mainPackage,
} from '@/server/changelogEntries'
import { groupFeeds } from '@/server/changelogFeed'
import { renderChangelogMarkdown } from '@/server/renderChangelogMarkdown'
import { stripTags } from '@/utils/stripTags'

// The changelog page and each package's history, generated from the package
// changelogs. The server renders each change's Markdown; the timeline and the
// filters take it from there.

/** Timeline items as the timeline shows them, with each change rendered to HTML. */
function toReleases(items: TimelineItem[], showFeature: boolean): TimelineRelease[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    version: item.version,
    hiddenFixes: item.fixCount,
    date: item.date ? formatDay(item.date) : undefined,
    source: showFeature ? item.source : undefined,
    link: item.link,
    changes: item.entries.map((entry) => {
      const html = renderChangelogMarkdown(entry.text)
      const breaking = entry.breaking && {
        what: renderChangelogMarkdown(entry.breaking.what),
        who: renderChangelogMarkdown(entry.breaking.who),
        migrate: renderChangelogMarkdown(entry.breaking.migrate),
        url: entry.breaking.url,
      }
      return {
        breaking,
        type: entry.type,
        // A Pro release is one feature already, so its changes don't repeat it
        feature: showFeature && item.source === 'Open source' ? entry.feature : undefined,
        html,
        text: stripTags(html),
      }
    }),
  }))
}

const HIGHLIGHT_VARIANT = { New: 'success', Improved: 'gray', Breaking: 'hint' } as const

/** The latest hand-written highlights, as cards that lead to the docs. */
export const ChangelogHighlights = ({ limit = 4 }: { limit?: number }) => (
  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
    {CHANGELOG_HIGHLIGHTS.slice(0, limit).map((highlight) => (
      <Card isClickable asChild key={`${highlight.feature}-${highlight.version}`}>
        <Link href={highlight.url} className="flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-sm text-grayAlpha-600">
            <Tag size="small" variant={HIGHLIGHT_VARIANT[highlight.type]}>
              {highlight.type}
            </Tag>
            {formatDay(highlight.date)}
          </div>
          <div className="font-semibold text-black leading-[140%]">{highlight.title}</div>
          <div className="mt-2 mb-4 text-sm leading-[140%] text-grayAlpha-600">
            {highlight.text}
          </div>
          <div className="mt-auto pt-3 border-t border-grayAlpha-100 text-sm text-grayAlpha-600">
            {highlight.feature} {highlight.version}
          </div>
        </Link>
      </Card>
    ))}
  </div>
)

/** Every Tiptap release in one timeline, with filters. */
export const ChangelogReleases = () => (
  <ChangelogReleasesFiltered
    releases={toReleases(getReleaseTimeline(), true)}
    older={toReleases(getOlderOpenSourceReleases(), true)}
  />
)

/** Every package's history, by name, with filters. */
export const ChangelogPackages = () => (
  <ChangelogPackagesFiltered
    packages={getPackageHistories().map(({ name, packageName, slug, source }) => ({
      name,
      packageName,
      href: historyUrl(slug),
      source,
    }))}
  />
)

/** RSS feeds: everything, and one per feature group. */
export const ChangelogFeeds = () => (
  <ul className="!list-none !pl-0 flex flex-wrap gap-2">
    {[
      { id: 'all', title: 'All releases', href: '/resources/changelog/rss.xml' },
      ...groupFeeds(),
    ].map((feed) => (
      <li key={feed.id} className="before:!hidden !m-0">
        <Link
          href={feed.href}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-neutral-300 bg-white text-sm no-underline hover:border-neutral-500"
        >
          <RssIcon className="size-3.5 text-orange-500" aria-hidden="true" />
          {feed.title}
        </Link>
      </li>
    ))}
  </ul>
)

/** One package's history as a timeline, every change shown. */
export const PackageTimeline = ({ slug }: { slug: string }) => {
  const timeline = getPackageTimeline(slug)
  if (!timeline) return null
  return (
    <>
      <ReleaseTimeline releases={toReleases(timeline.items, false)} foldFixes={false} />
      {timeline.quietVersions ? (
        <p className="mt-8 text-sm text-grayAlpha-600">
          {timeline.quietVersions} more {timeline.quietVersions === 1 ? 'version' : 'versions'} only
          updated dependencies.
        </p>
      ) : null}
    </>
  )
}

/**
 * One line at the end of a feature page: its latest version and where to see
 * what changed. The version shows only when the registry confirmed it, so an
 * unreleased version on the branch never appears.
 */
export const LatestVersion = ({ name, packages }: { name: string; packages?: string }) => {
  const main = mainPackage({ name, package: packages })
  const latest = main ? getLatestVersion(main) : undefined
  if (!latest) return null
  return (
    <p className="mt-12 pt-6 border-t border-grayAlpha-200 text-sm text-grayAlpha-600">
      {latest.date ? (
        <>
          Latest version {latest.version} · {formatDay(latest.date)} ·{' '}
        </>
      ) : null}
      <Link href={historyUrl(latest.slug)} className="underline hover:text-purple-600">
        What changed
      </Link>
    </p>
  )
}
