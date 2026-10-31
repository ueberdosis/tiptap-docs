'use client'

import { ArrowRightIcon, SearchIcon, XIcon } from 'lucide-react'
import { useMemo } from 'react'
import Link from '@/components/Link'
import { MultiSelect, useListParam } from '@/components/FilterControls.client'
import { ReleaseTimeline, TimelineRelease } from '@/components/ReleaseTimeline'
import { Tag } from '@/components/ui/Tag'
import { useUrlParam } from '@/hooks/useUrlParam'
import { cn } from '@/utils'
import { compareVersions } from '@/utils/compareVersions'

// The changelog's releases and packages, with the filters the feature catalog has

const SOURCES = ['Open source', 'Pro'].map((id) => ({ id, label: id }))
const TYPES = ['New', 'Breaking', 'Fixed'].map((id) => ({ id, label: id }))

const SearchField = ({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (value: string) => void // eslint-disable-line no-unused-vars
  label: string
}) => (
  <label className="flex-1 min-w-[10rem] sm:flex-none flex items-center h-9 px-2.5 gap-2 bg-white sm:w-64 rounded-lg border border-neutral-300 focus-within:border-neutral-700">
    <SearchIcon className="w-4 h-4 text-neutral-500" aria-hidden="true" />
    <input
      type="text"
      className="w-full outline-none text-sm"
      placeholder={`${label}...`}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    {value ? (
      <button
        type="button"
        className="p-0.5 rounded hover:bg-neutral-100"
        onClick={() => onChange('')}
        aria-label="Clear search"
      >
        <XIcon className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    ) : null}
  </label>
)

const Count = ({ count, noun, onReset }: { count: number; noun: string; onReset?: () => void }) => (
  <div className="flex items-center gap-2 ml-auto text-sm text-grayAlpha-600">
    <span aria-live="polite">
      {count} {count === 1 ? noun : `${noun}s`}
    </span>
    {onReset ? (
      <button
        type="button"
        onClick={onReset}
        className="px-2 py-1 rounded-md text-black hover:bg-grayAlpha-100"
      >
        Reset
      </button>
    ) : null}
  </div>
)

/**
 * Releases, filterable by open source or Pro, change type, and text. "Upgrading
 * from" lists every open source release after a version, back to the start of
 * the current major version.
 */
export const ChangelogReleasesFiltered = ({
  releases,
  older,
}: {
  releases: TimelineRelease[]
  older: TimelineRelease[]
}) => {
  const [query, setQuery] = useUrlParam('search', '')
  const [sources, setSources] = useListParam('source')
  const [types, setTypes] = useListParam('type')
  const [from, setFrom] = useUrlParam('from', '')
  const isFiltered = !!query || !!from || sources.length + types.length > 0

  // Every open source version a reader may upgrade from, newest first
  const versions = useMemo(
    () =>
      [...releases, ...older]
        .filter((release) => release.source === 'Open source' && release.version)
        .map((release) => release.version!)
        .sort(compareVersions),
    [releases, older],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const base = from
      ? [...releases, ...older].filter(
          (release) =>
            release.source === 'Open source' &&
            !!release.version &&
            compareVersions(release.version, from) < 0,
        )
      : releases
    return base
      .filter((release) => sources.length === 0 || sources.includes(release.source ?? ''))
      .map((release) => ({
        ...release,
        changes: release.changes.filter(
          (change) =>
            (types.length === 0 || types.includes(change.type)) &&
            (!needle ||
              change.text.toLowerCase().includes(needle) ||
              (change.feature?.name ?? '').toLowerCase().includes(needle) ||
              release.title.toLowerCase().includes(needle)),
        ),
      }))
      .filter(
        (release) =>
          release.changes.length > 0 || (!!release.hiddenFixes && !needle && types.length === 0),
      )
  }, [releases, older, query, sources, types, from])

  const reset = () => {
    setQuery('')
    setSources([])
    setTypes([])
    setFrom('')
  }

  return (
    <div className="grid gap-8">
      <div role="search" aria-label="Filter releases" className="flex flex-wrap items-center gap-2">
        <SearchField value={query} onChange={setQuery} label="Search changes" />
        <MultiSelect label="Source" options={SOURCES} values={sources} onChange={setSources} />
        <MultiSelect label="Type" options={TYPES} values={types} onChange={setTypes} />
        <label
          className={cn(
            'inline-flex items-center gap-1.5 h-9 pl-3 pr-2 rounded-lg border text-sm whitespace-nowrap',
            from
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-neutral-300 bg-white text-black hover:border-neutral-500',
          )}
        >
          <span className={from ? 'font-semibold' : undefined}>Upgrading from</span>
          <select
            className="bg-transparent outline-none cursor-pointer"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          >
            <option value="">any version</option>
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </label>
        <Count count={visible.length} noun="release" onReset={isFiltered ? reset : undefined} />
      </div>
      {from ? (
        <p className="-mt-4 text-sm text-grayAlpha-700">
          Open source releases after {from}. Older releases list new and breaking changes; their
          fixes are in the release notes.
        </p>
      ) : null}
      {visible.length ? (
        // A search or a type filter shows the fixes it found instead of folding them
        <ReleaseTimeline releases={visible} foldFixes={!query && !types.includes('Fixed')} />
      ) : (
        <p className="text-neutral-700">No changes match your filters.</p>
      )}
    </div>
  )
}

export type PackageHistory = {
  name: string
  packageName: string
  href: string
  source: 'Open source' | 'Pro'
}

/** Every package's history, by name, filterable by open source or Pro and text. */
export const ChangelogPackagesFiltered = ({ packages }: { packages: PackageHistory[] }) => {
  const [query, setQuery] = useUrlParam('package', '')
  const [sources, setSources] = useListParam('packages')
  const isFiltered = !!query || sources.length > 0

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return packages.filter(
      (item) =>
        (sources.length === 0 || sources.includes(item.source)) &&
        (!needle ||
          item.name.toLowerCase().includes(needle) ||
          item.packageName.toLowerCase().includes(needle)),
    )
  }, [packages, query, sources])

  return (
    <div className="grid gap-6">
      <div role="search" aria-label="Filter packages" className="flex flex-wrap items-center gap-2">
        <SearchField value={query} onChange={setQuery} label="Search packages" />
        <MultiSelect label="Source" options={SOURCES} values={sources} onChange={setSources} />
        <Count
          count={visible.length}
          noun="package"
          onReset={
            isFiltered
              ? () => {
                  setQuery('')
                  setSources([])
                }
              : undefined
          }
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-x-6">
        {visible.map((item) => (
          <Link
            key={item.packageName}
            href={item.href}
            className="group flex items-center gap-3 py-4 border-b border-grayAlpha-100 no-underline"
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-medium text-black group-hover:text-purple-600">
                  {item.name}
                </span>
                {item.source === 'Pro' ? (
                  <Tag className="select-none" size="small" variant="info">
                    Pro
                  </Tag>
                ) : null}
              </span>
              {/* The npm name, for readers who search by it */}
              <span className="block truncate font-mono text-xs text-grayAlpha-500">
                {item.packageName}
              </span>
            </span>
            <ArrowRightIcon
              className="size-4 flex-none text-grayAlpha-400 group-hover:text-black"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
