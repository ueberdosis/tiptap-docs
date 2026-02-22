'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Fragment, useCallback, useMemo } from 'react'
import { Highlight, InstantSearch, SearchBox, useHits, useInstantSearch } from 'react-instantsearch'
import { useHotkeys } from '@mantine/hooks'
import Link from '@/components/Link'
import { typesenseAdapter } from '@/utils/search'
import { useCommands } from '@/hooks/useCommands'
import { cn } from '@/utils'
import { SearchHit } from '@/types'
import { useAppState } from '@/providers/AppState'

const SearchResult = ({ hit, active }: { hit: SearchHit; active?: boolean }) => {
  const { result, parents } = useMemo(() => {
    const hierarchy = Object.entries(hit.hierarchy).filter((h) => !!h[1])
    const result = hierarchy.at(-1)
    const parents = hierarchy.slice(0, -1)

    return {
      result,
      parents,
      hierarchy,
    }
  }, [hit])

  if (!result) {
    return null
  }

  const linkClassName = cn(
    'p-2.5 bg-white border border-grayAlpha-200 shadow-cardLight block rounded-lg',
    active ? 'bg-neutral-100' : 'hover:bg-neutral-50',
  )

  return (
    <Dialog.Close asChild>
      <Link className={linkClassName} href={hit.url}>
        <span className="block font-semibold">{result[1]}</span>
        <Highlight hit={hit as any} attribute="content" className="text-sm my-2 block" />
        {parents ? (
          <span className="flex items-center gap-0.5 flex-wrap mt-1 font-medium">
            {parents.map(([key, value], i) => (
              <Fragment key={key}>
                <span className="block text-xs text-grayAlpha-500">{value}</span>
                {i < parents.length - 1 ? (
                  <span className="block text-xs text-grayAlpha-400">/</span>
                ) : null}
              </Fragment>
            ))}
          </span>
        ) : null}
      </Link>
    </Dialog.Close>
  )
}

const SearchWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <InstantSearch
      searchClient={typesenseAdapter.searchClient}
      indexName={process.env.NEXT_PUBLIC_DOCSEARCH_INDEX || ''}
    >
      {children}
    </InstantSearch>
  )
}

const SearchContent = () => {
  const hits = useHits()
  const search = useInstantSearch()
  const query = search.indexRenderState.searchBox?.query || ''

  // Re-rank hits: prefer lvl0 titles that cover all query tokens, then any hierarchy coverage
  const rankedHits = useMemo(() => {
    if (!query || hits.hits.length === 0) return hits.hits

    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)

    if (tokens.length === 0) return hits.hits

    const inText = (text: string) => {
      const t = text.toLowerCase()

      return tokens.every((tok) => t.includes(tok))
    }

    const titleMatches: typeof hits.hits = []

    const hierarchyMatches: typeof hits.hits = []

    const otherMatches: typeof hits.hits = []

    hits.hits.forEach((hit) => {
      const searchHit = hit as unknown as SearchHit

      const lvl0 = searchHit.hierarchy?.lvl0 || ''
      const allHierarchy = [
        searchHit.hierarchy?.lvl0,
        searchHit.hierarchy?.lvl1,
        searchHit.hierarchy?.lvl2,
        searchHit.hierarchy?.lvl3,
        searchHit.hierarchy?.lvl4,
        searchHit.hierarchy?.lvl5,
        searchHit.hierarchy?.lvl6,
      ]
        .filter(Boolean)
        .join(' ')

      if (inText(lvl0)) {
        titleMatches.push(hit)
      } else if (inText(allHierarchy)) {
        hierarchyMatches.push(hit)
      } else {
        otherMatches.push(hit)
      }
    })

    return [...titleMatches, ...hierarchyMatches, ...otherMatches]
  }, [query, hits])

  const { currentIndex, onKeyDown } = useCommands(query.length === 0 ? [] : rankedHits)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (currentIndex !== null) {
        const hit = rankedHits[currentIndex]
        if (typeof window === 'undefined') {
          return
        }

        window.location.href = hit.url as string
      }
    },
    [currentIndex, rankedHits],
  )

  return (
    <>
      <SearchBox
        autoFocus
        className="flex-none"
        placeholder="Search the documentation…"
        onKeyUp={onKeyDown}
        onSubmit={handleSubmit}
        classNames={{
          form: 'flex items-center gap-2',
          reset: 'hidden',
          submit: 'hidden',
          loadingIcon: 'hidden',
          input:
            'w-full appearance-none rounded shadow-cardLight border border-grayAlpha-200 p-2 text-sm outline-none hover:border-grayAlpha-300 focus:border-grayAlpha-400',
        }}
      />
      {query && rankedHits.length > 0 ? <div className="h-4"></div> : null}
      <div className="overflow-auto max-h-[calc(100vh-10rem)] flex flex-col gap-1">
        {query && rankedHits.length > 0
          ? rankedHits.map((hit, i) => (
              <SearchResult
                hit={hit as unknown as SearchHit}
                active={i === currentIndex}
                key={hit.objectID}
              />
            ))
          : null}
        {query && rankedHits.length === 0 ? (
          <div className="flex items-center justify-center p-2 mt-2">
            <span className="text-grayAlpha-400">
              No results found for <strong>{query}</strong>
            </span>
          </div>
        ) : null}
      </div>
    </>
  )
}

export const Search = () => {
  const { searchOpen, setSearchOpen } = useAppState()
  useHotkeys([['mod+k', () => setSearchOpen(!searchOpen)]])

  return (
    <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
      <Dialog.Trigger asChild></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur" />
        <div className="fixed inset-0 z-50 flex items-start justify-center p-5 pointer-events-none">
          <Dialog.Content className="flex flex-col bg-warmGray dark:bg-gray-950 dark:text-white rounded-lg p-2 pointer-events-auto w-full max-w-[40rem] max-h-[90%] shadow-xl">
            {searchOpen ? (
              <SearchWrapper>
                <SearchContent />
              </SearchWrapper>
            ) : null}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
