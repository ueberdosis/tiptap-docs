import Link from '@/components/Link'
import {
  ChangelogPackagesFiltered,
  ChangelogReleasesFiltered,
} from '@/components/ChangelogFilters.client'
import { ReleaseTimeline, TimelineRelease } from '@/components/ReleaseTimeline'
import {
  TimelineItem,
  formatDay,
  getLatestVersion,
  getPackageHistories,
  getPackageTimeline,
  getReleaseTimeline,
  historyUrl,
  mainPackage,
} from '@/server/changelogEntries'
import { renderMarkdown } from '@/server/renderMarkdown'

// The changelog page and each package's history, generated from the package
// changelogs. The server renders each change's Markdown; the timeline and the
// filters take it from there.

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '')

/** Timeline items as the timeline shows them, with each change rendered to HTML. */
async function toReleases(items: TimelineItem[], showFeature: boolean): Promise<TimelineRelease[]> {
  return Promise.all(
    items.map(async (item) => ({
      id: item.id,
      title: item.title,
      date: item.date ? formatDay(item.date) : undefined,
      source: showFeature ? item.source : undefined,
      link: item.link,
      changes: await Promise.all(
        item.entries.map(async (entry) => {
          const html = await renderMarkdown(entry.text)
          return {
            type: entry.type,
            // A Pro release is one feature already, so its changes don't repeat it
            feature: showFeature && item.source === 'Open source' ? entry.feature : undefined,
            html,
            text: stripHtml(html),
          }
        }),
      ),
    })),
  )
}

/** Every Tiptap release in one timeline, with filters. */
export const ChangelogReleases = async () => (
  <ChangelogReleasesFiltered releases={await toReleases(getReleaseTimeline(), true)} />
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

/** One package's history as a timeline, every change shown. */
export const PackageTimeline = async ({ slug }: { slug: string }) => {
  const timeline = getPackageTimeline(slug)
  if (!timeline) return null
  return (
    <>
      <ReleaseTimeline releases={await toReleases(timeline.items, false)} foldFixes={false} />
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
