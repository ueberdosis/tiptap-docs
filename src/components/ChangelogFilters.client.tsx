'use client'

import { ArrowRightIcon, SearchIcon, XIcon } from 'lucide-react'
import { useMemo } from 'react'
import Link from '@/components/Link'
import { MultiSelect, useListParam } from '@/components/FilterControls.client'
import { ReleaseTimeline, TimelineRelease } from '@/components/ReleaseTimeline'
import { Tag } from '@/components/ui/Tag'
import { useUrlParam } from '@/hooks/useUrlParam'

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

/** Releases, filterable by open source or Pro, change type, and text. */
export const ChangelogReleasesFiltered = ({ releases }: { releases: TimelineRelease[] }) => {
  const [query, setQuery] = useUrlParam('search', '')
  const [sources, setSources] = useListParam('source')
  const [types, setTypes] = useListParam('type')
  const isFiltered = !!query || sources.length + types.length > 0

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return releases
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
      .filter((release) => release.changes.length > 0)
  }, [releases, query, sources, types])

  const reset = () => {
    setQuery('')
    setSources([])
    setTypes([])
  }

  return (
    <div className="grid gap-8">
      <div role="search" aria-label="Filter releases" className="flex flex-wrap items-center gap-2">
        <SearchField value={query} onChange={setQuery} label="Search changes" />
        <MultiSelect label="Source" options={SOURCES} values={sources} onChange={setSources} />
        <MultiSelect label="Type" options={TYPES} values={types} onChange={setTypes} />
        <Count count={visible.length} noun="release" onReset={isFiltered ? reset : undefined} />
      </div>
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
            className="group flex items-center gap-3 py-2 border-b border-grayAlpha-100 no-underline"
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-medium text-black group-hover:text-purple-600">
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
