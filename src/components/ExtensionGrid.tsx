/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { SearchIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { CloseIcon } from '@codesandbox/sandpack-react'
import { Tag } from './ui/Tag'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import Link from '@/components/Link'
import { ExtensionMetaWithUrl } from '@/types'
import { getIcon } from '@/utils/iconKit'
import { useQueryParam } from '@/hooks/useQueryParams'

const SEARCH_FILTER = {
  ALL: 'all',
  FREE: 'free',
  PRO: 'pro',
  CLOUD: 'cloud',
  EXPERIMENT: 'experiment',
} as const

type SearchFilter = (typeof SEARCH_FILTER)[keyof typeof SEARCH_FILTER]

function useSearch() {
  const [query, setQuery] = useQueryParam('search', '')
  const [filter, setFilter] = useQueryParam<SearchFilter>('filter', SEARCH_FILTER.ALL)

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  const clear = useCallback(() => {
    setQuery('')
  }, [])

  const showAll = useCallback(() => {
    setFilter(SEARCH_FILTER.ALL)
  }, [])

  const showFree = useCallback(() => {
    setFilter(SEARCH_FILTER.FREE)
  }, [])

  const showPro = useCallback(() => {
    setFilter(SEARCH_FILTER.PRO)
  }, [])

  const showCloud = useCallback(() => {
    setFilter(SEARCH_FILTER.CLOUD)
  }, [])

  const showExperiment = useCallback(() => {
    setFilter(SEARCH_FILTER.EXPERIMENT)
  }, [])

  return {
    query,
    handleInput,
    clear,
    filter,
    showAll,
    showFree,
    showPro,
    showCloud,
    showExperiment,
  }
}

function useFilteredExtensions(
  query: string,
  extensions?: ExtensionMetaWithUrl[],
  filter?: SearchFilter,
) {
  if (!extensions) return []

  return extensions.filter((ext) => {
    if (filter === SEARCH_FILTER.FREE && ext.isPro) return false
    if (filter === SEARCH_FILTER.PRO && !ext.isPro) return false
    if (filter === SEARCH_FILTER.CLOUD && !ext.isCloud) return false
    if (filter === SEARCH_FILTER.EXPERIMENT && !ext.isExperiment) return false

    return (
      ext.name.toLowerCase().includes(query.toLowerCase()) ||
      ext.description.toLowerCase().includes(query.toLowerCase())
    )
  })
}

function ExtensionCard({ ext }: { ext: ExtensionMetaWithUrl }) {
  const Icon = getIcon(ext.icon)
  return (
    <Card isClickable asChild>
      <Link href={ext.url} key={ext.path}>
        <div className="flex items-center justify-between gap-2 mb-5">
          {!!Icon ? <Icon className="w-3.5 h-3.5" /> : null}
          <div className="ml-auto flex items-center gap-1">
            {ext.isNew ? <Tag variant="info">New</Tag> : null}
          </div>
        </div>
        <div className="font-semibold text-black leading-[140%]">{ext.name}</div>
        <div className="mt-2 leading-[140%] text-grayAlpha-600">{ext.description}</div>
        <div className="mt-5 flex items-center flex-wrap gap-1">
          {ext.isCloud ? <Tag>Cloud</Tag> : null}
          {ext.isPro ? <Tag>Pro</Tag> : null}
          {ext.isExperiment ? <Tag variant="warning">Experiment</Tag> : null}
        </div>
      </Link>
    </Card>
  )
}

function ExtensionGroup({
  extensions,
  title,
}: {
  extensions: ExtensionMetaWithUrl[]
  title: string
}) {
  return (
    <div>
      <div className="text-xl font-bold mb-6 leading-[120%]">{title}</div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 xl:gap-5">
        {extensions.map((ext) => (
          <ExtensionCard ext={ext} key={ext.path} />
        ))}
      </div>
    </div>
  )
}

function FilterButton({
  onClick,
  children,
  isActive,
}: {
  onClick: () => void
  children: React.ReactNode
  isActive?: boolean
}) {
  return (
    <Button variant="tertiary" isActive={isActive} onClick={onClick}>
      {children}
    </Button>
  )
}

function useAllExtensions(
  nodeExtensions: ExtensionMetaWithUrl[] | undefined,
  markExtensions: ExtensionMetaWithUrl[] | undefined,
  functionalityExtensions: ExtensionMetaWithUrl[] | undefined,
) {
  return [...(nodeExtensions || []), ...(markExtensions || []), ...(functionalityExtensions || [])]
}

export type ExtensionGridProps = {
  nodeExtensions?: ExtensionMetaWithUrl[]
  markExtensions?: ExtensionMetaWithUrl[]
  functionalityExtensions?: ExtensionMetaWithUrl[]
  hideAll?: boolean
  hideFree?: boolean
}

export const ExtensionGrid = ({
  functionalityExtensions,
  markExtensions,
  nodeExtensions,
  hideAll,
  hideFree,
}: ExtensionGridProps) => {
  const { clear, handleInput, query, filter, showAll, showFree, showPro, showCloud } = useSearch()
  const allExtensions = useAllExtensions(nodeExtensions, markExtensions, functionalityExtensions)
  const filteredNodeExtensions = useFilteredExtensions(query, nodeExtensions, filter)
  const filteredMarkExtensions = useFilteredExtensions(query, markExtensions, filter)
  const filteredFunctionalityExtensions = useFilteredExtensions(
    query,
    functionalityExtensions,
    filter,
  )

  const hasFreeExtensions = useMemo(() => allExtensions.some((ext) => !ext.isPro), [allExtensions])
  const hasProExtensions = useMemo(() => allExtensions.some((ext) => ext.isPro), [allExtensions])
  const hasCloudExtensions = useMemo(
    () => allExtensions.some((ext) => ext.isCloud),
    [allExtensions],
  )

  const noExtensions =
    (!nodeExtensions && !markExtensions && !functionalityExtensions) ||
    (filteredNodeExtensions.length === 0 &&
      filteredMarkExtensions.length === 0 &&
      filteredFunctionalityExtensions.length === 0)

  return (
    <div className="grid gap-8">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
        <label className="flex flex-1 items-center p-2 gap-2 justify-center bg-white max-w-[36rem] rounded-lg border border-neutral-300 focus-within:border-neutral-700">
          <SearchIcon className="w-4 h-4 text-neutral-500" />
          <input
            type="text"
            className="w-full outline-none"
            placeholder="Filter extensions..."
            value={query}
            onChange={handleInput}
          />
          {query ? (
            <button className="p-1 hover:bg-neutral-100" onClick={clear}>
              <CloseIcon />
            </button>
          ) : null}
        </label>
        <div className="flex flex-none items-center gap-1 sm:ml-auto">
          {!hideAll ? (
            <FilterButton isActive={filter === SEARCH_FILTER.ALL} onClick={showAll}>
              All
            </FilterButton>
          ) : null}
          {hasFreeExtensions && !hideFree ? (
            <FilterButton isActive={filter === SEARCH_FILTER.FREE} onClick={showFree}>
              Free
            </FilterButton>
          ) : null}
          {hasProExtensions ? (
            <FilterButton isActive={filter === SEARCH_FILTER.PRO} onClick={showPro}>
              Pro
            </FilterButton>
          ) : null}
          {hasCloudExtensions ? (
            <FilterButton isActive={filter === SEARCH_FILTER.CLOUD} onClick={showCloud}>
              Cloud
            </FilterButton>
          ) : null}
        </div>
      </div>
      <div className="grid gap-20 first:mt-0 last:mb-0">
        {noExtensions ? (
          <div className="text-neutral-700">
            No extensions found for{' '}
            {query ? <span className="font-semibold">&quot;{query}&quot;</span> : 'your filters.'}
          </div>
        ) : null}
        {nodeExtensions && filteredNodeExtensions.length > 0 ? (
          <ExtensionGroup extensions={filteredNodeExtensions} title="Nodes" />
        ) : null}
        {markExtensions && filteredMarkExtensions.length > 0 ? (
          <ExtensionGroup extensions={filteredMarkExtensions} title="Marks" />
        ) : null}
        {functionalityExtensions && filteredFunctionalityExtensions.length > 0 ? (
          <ExtensionGroup extensions={filteredFunctionalityExtensions} title="Functionality" />
        ) : null}
      </div>
    </div>
  )
}
