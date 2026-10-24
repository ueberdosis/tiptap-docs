import { Fragment } from 'react'
import { Tag } from '@/components/ui/Tag'
import Link from '@/components/Link'

// Releases as a timeline: a line down the left, a tick and a ring for each
// release, its changes in a grid so the text always starts at the same place.
// Used by the changelog page and each package's history.

export type ChangeKind = 'Breaking' | 'New' | 'Fixed'

export type TimelineChange = {
  type: ChangeKind
  /** Shown before the change when a release covers several features. */
  feature?: { name: string; url?: string }
  /** The change as HTML, rendered from its Markdown on the server. */
  html: string
  /** Plain text to search in. */
  text: string
  /** For a breaking change: what changes, who is affected, how to migrate, as HTML. */
  breaking?: { what: string; who: string; migrate: string; url?: string }
}

export type TimelineRelease = {
  id: string
  title: string
  /** Already formatted, such as "Oct 13, 2026". */
  date?: string
  source?: 'Open source' | 'Pro'
  link?: { label: string; href: string }
  changes: TimelineChange[]
}

const TYPE_VARIANT: Record<ChangeKind, 'hint' | 'success' | 'gray'> = {
  Breaking: 'hint',
  New: 'success',
  Fixed: 'gray',
}

/** What a breaking change means for you, in the same three steps every time. */
const BreakingNote = ({ note }: { note: NonNullable<TimelineChange['breaking']> }) => (
  <div className="mt-2 p-3 rounded-lg border border-yellow-300 bg-yellow-50 text-sm">
    <dl className="grid sm:grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 [&_p]:inline">
      {(
        [
          ['What changes', note.what],
          ['Who is affected', note.who],
          ['How to migrate', note.migrate],
        ] as const
      ).map(([term, html]) => (
        <Fragment key={term}>
          <dt className="font-semibold text-black">{term}</dt>
          <dd className="m-0" dangerouslySetInnerHTML={{ __html: html }} />
        </Fragment>
      ))}
    </dl>
    {note.url ? (
      <Link
        href={note.url}
        className="inline-block mt-2 font-medium underline hover:text-purple-600"
      >
        Details
      </Link>
    ) : null}
  </div>
)

const ChangeGrid = ({ changes }: { changes: TimelineChange[] }) => (
  // The label column is as wide as its widest label; every label is at least as wide as "Fixed",
  // so the text starts at the same place above and below the folded fixes
  <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-2 text-[0.9375rem] leading-[1.5]">
    {changes.map((change, index) => (
      <Fragment key={index}>
        <div className="pt-px">
          <Tag
            className="select-none inline-flex min-w-9 justify-center"
            size="small"
            variant={TYPE_VARIANT[change.type]}
          >
            {change.type}
          </Tag>
        </div>
        <div className="min-w-0 pt-0.5 [&_p]:inline [&_p+p]:block [&_p+p]:mt-2 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5">
          {change.feature ? (
            <strong className="mr-1 font-semibold">
              {change.feature.url ? (
                <Link href={change.feature.url}>{change.feature.name}</Link>
              ) : (
                change.feature.name
              )}
              :
            </strong>
          ) : null}
          <span dangerouslySetInnerHTML={{ __html: change.html }} />
          {change.breaking ? <BreakingNote note={change.breaking} /> : null}
        </div>
      </Fragment>
    ))}
  </div>
)

const ReleaseItem = ({ release, foldFixes }: { release: TimelineRelease; foldFixes: boolean }) => {
  const notable = foldFixes
    ? release.changes.filter((change) => change.type !== 'Fixed')
    : release.changes
  const fixes = foldFixes ? release.changes.filter((change) => change.type === 'Fixed') : []
  return (
    <section id={release.id} className="relative pl-8 pb-10 last:pb-1 scroll-mt-28">
      {/* A 12px tick from the line, and an 8px ring centred on it */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-3 w-3 border-t border-grayAlpha-300"
      />
      <span
        aria-hidden="true"
        className="absolute left-3 top-[8.5px] size-2 rounded-full border border-grayAlpha-400 bg-warmGray"
      />
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-3">
        <h3 className="!m-0 !text-[1.0625rem] !leading-6 font-semibold text-black">
          {release.title}
        </h3>
        {release.date ? <span className="text-sm text-grayAlpha-600">{release.date}</span> : null}
        {release.source ? (
          <Tag
            className="self-center select-none"
            size="small"
            variant={release.source === 'Pro' ? 'info' : 'gray'}
          >
            {release.source}
          </Tag>
        ) : null}
        {release.link ? (
          <Link
            href={release.link.href}
            className="ml-auto text-sm text-grayAlpha-600 hover:text-black"
          >
            {release.link.label}
          </Link>
        ) : null}
      </div>
      {notable.length ? <ChangeGrid changes={notable} /> : null}
      {fixes.length ? (
        <details className={notable.length ? 'mt-3' : undefined}>
          <summary className="cursor-pointer text-sm text-grayAlpha-700 select-none outline-none focus-visible:text-black focus-visible:underline">
            {fixes.length} {fixes.length === 1 ? 'fix' : 'fixes'}
          </summary>
          <div className="mt-2">
            <ChangeGrid changes={fixes} />
          </div>
        </details>
      ) : null}
    </section>
  )
}

/** A list of releases on a line, newest first. Fixes fold away unless `foldFixes` is off. */
export const ReleaseTimeline = ({
  releases,
  foldFixes = true,
}: {
  releases: TimelineRelease[]
  foldFixes?: boolean
}) => (
  <div className="relative ml-1 border-l border-grayAlpha-300 not-prose">
    {releases.map((release) => (
      <ReleaseItem release={release} foldFixes={foldFixes} key={release.id} />
    ))}
  </div>
)
