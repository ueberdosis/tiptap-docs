import { Fragment } from 'react'
import { Tag } from '@/components/ui/Tag'
import Link from '@/components/Link'
import {
  ChangeType,
  ChangelogEntry,
  formatDay,
  getOpenSourceReleases,
  getPackageHistories,
  getLatestVersion,
  getProUpdates,
  historyUrl,
  mainPackage,
} from '@/server/changelogEntries'
import { renderMarkdown } from '@/server/renderMarkdown'

// The changelog page: Tiptap releases, the latest change of each Pro feature,
// and every package's history. Generated from the package changelogs.

const TYPE_VARIANT: Record<ChangeType, 'hint' | 'success' | 'gray'> = {
  Breaking: 'hint',
  New: 'success',
  Fixed: 'gray',
}

async function Entry({
  entry,
  showFeature = true,
}: {
  entry: ChangelogEntry
  showFeature?: boolean
}) {
  const html = await renderMarkdown(entry.text)
  return (
    <li className="flex gap-2 items-baseline before:!hidden">
      <Tag className="flex-none select-none" size="small" variant={TYPE_VARIANT[entry.type]}>
        {entry.type}
      </Tag>
      <div className="min-w-0 [&>p]:inline [&>p+p]:block [&>p+p]:mt-2">
        {showFeature ? (
          <strong className="mr-1">
            {entry.feature.url ? (
              <Link href={entry.feature.url}>{entry.feature.name}</Link>
            ) : (
              entry.feature.name
            )}
            :
          </strong>
        ) : null}
        <span className="[&>p]:inline" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </li>
  )
}

const EntryList = ({
  entries,
  showFeature,
}: {
  entries: ChangelogEntry[]
  showFeature?: boolean
}) => (
  <ul className="!list-none !pl-0 grid gap-2">
    {entries.map((entry, index) => (
      <Entry entry={entry} showFeature={showFeature} key={`${entry.packageName}-${index}`} />
    ))}
  </ul>
)

/** The latest open source releases; new and breaking changes first, fixes folded. */
export const ChangelogReleases = ({ limit = 6 }: { limit?: number }) => (
  <>
    {getOpenSourceReleases(limit).map((release) => {
      const notable = release.entries.filter((entry) => entry.type !== 'Fixed')
      const fixes = release.entries.filter((entry) => entry.type === 'Fixed')
      return (
        <Fragment key={release.version}>
          <h3 id={`v${release.version.replace(/\./g, '-')}`}>
            Tiptap {release.version}
            {release.date ? (
              <span className="font-normal text-grayAlpha-600"> · {formatDay(release.date)}</span>
            ) : null}
          </h3>
          {notable.length ? <EntryList entries={notable} /> : null}
          {fixes.length ? (
            <details className="mt-3">
              <summary className="cursor-pointer text-grayAlpha-700">
                {fixes.length} {fixes.length === 1 ? 'fix' : 'fixes'} in{' '}
                {new Set(fixes.map((entry) => entry.feature.name)).size} packages
              </summary>
              <div className="mt-3">
                <EntryList entries={fixes} />
              </div>
            </details>
          ) : null}
          <p className="text-sm">
            <Link href={`https://github.com/ueberdosis/tiptap/releases/tag/v${release.version}`}>
              Release on GitHub
            </Link>
          </p>
        </Fragment>
      )
    })}
  </>
)

/** The latest version of each Pro feature that changed something. */
export const ChangelogProUpdates = () => (
  <>
    {getProUpdates().map((update) => (
      <Fragment key={update.feature.name}>
        <h3 id={`pro-${update.feature.name.toLowerCase().replace(/\s+/g, '-')}`}>
          <Link href={update.feature.url!}>{update.feature.name}</Link> {update.version}
          {update.date ? (
            <span className="font-normal text-grayAlpha-600"> · {formatDay(update.date)}</span>
          ) : null}
        </h3>
        <EntryList entries={update.entries} showFeature={false} />
      </Fragment>
    ))}
  </>
)

/** Every package's full history. */
export const ChangelogPackages = () => (
  <ul className="sm:columns-2">
    {getPackageHistories().map(({ packageName, slug }) => (
      <li key={slug}>
        <Link href={historyUrl(slug)}>
          <code>{packageName}</code>
        </Link>
      </li>
    ))}
  </ul>
)

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
