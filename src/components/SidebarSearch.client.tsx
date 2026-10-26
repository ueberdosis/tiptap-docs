'use client'

import { ChevronDownIcon, ChevronUpIcon, SearchIcon, XIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Configure, Highlight, InstantSearch, useHits, useSearchBox } from 'react-instantsearch'
import Link from '@/components/Link'
import { SearchHit, SidebarConfig, SidebarGroup, SidebarLink } from '@/types'
import { cn } from '@/utils'
import { typesenseAdapter } from '@/utils/search'

// Search in the sidebar: typing replaces the navigation with the results, which stay
// while the reader opens one after the other. Clearing the field brings the navigation
// back as it was. Pages come from the sidebar itself; full text comes from Typesense.

type Entry = Omit<SidebarLink, 'type'> | SidebarGroup

/** A result: a page from the sidebar, or a passage the full-text search found. */
type Result = {
  key: string
  href: string
  title: string
  trail: string[]
  hit?: SearchHit
}

// Like the open entries of the sidebar, the search lives for the whole visit
let rememberedQuery = ''
let rememberedActive = 0
let rememberedScroll = 0
// Set when the reader opens a result by key or arrow, so the list shows it after the page changes
let revealActive = false

const hasFullText = !!process.env.NEXT_PUBLIC_DOCSEARCH_HOST

const PAGE_HIGHLIGHT = 'sidebar-search'

/**
 * Marks the query's words in the page's content, as a browser's find does, so an
 * opened result shows where it matched. It changes no markup: the CSS Custom
 * Highlight API paints the ranges, and a browser without it shows none.
 */
function highlightOnPage(query: string) {
  const registry = typeof CSS !== 'undefined' ? CSS.highlights : undefined
  // The browser's Highlight, not the search's component of the same name
  const PageHighlight = globalThis.Highlight
  if (!registry || !PageHighlight) return
  registry.delete(PAGE_HIGHLIGHT)
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1)
  const root = document.querySelector('main')
  if (!words.length || !root) return
  const ranges: Range[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node && ranges.length < 500; node = walker.nextNode()) {
    const text = (node as Text).data.toLowerCase()
    for (const word of words) {
      for (let at = text.indexOf(word); at !== -1; at = text.indexOf(word, at + word.length)) {
        const range = new Range()
        range.setStart(node, at)
        range.setEnd(node, at + word.length)
        ranges.push(range)
      }
    }
  }
  registry.set(PAGE_HIGHLIGHT, new PageHighlight(...ranges))
}

/** Focuses the sidebar's search field if it is on screen; false where it isn't, such as on phones. */
export function focusSidebarSearch(): boolean {
  const field = document.querySelector<HTMLInputElement>('[data-sidebar-search] input')
  if (!field || field.offsetParent === null) return false
  field.focus()
  field.select()
  return true
}

/** Every page in the sidebar, with the titles above it. */
function sidebarPages(config: SidebarConfig): Result[] {
  const pages = new Map<string, Result>()
  const walk = (entries: Entry[], trail: string[]) => {
    for (const entry of entries) {
      const isGroup = 'type' in entry && entry.type === 'group'
      if (entry.href && !isGroup && !(entry as Omit<SidebarLink, 'type'>).external) {
        if (!pages.has(entry.href)) {
          pages.set(entry.href, { key: entry.href, href: entry.href, title: entry.title, trail })
        }
      }
      if (entry.children) walk(entry.children, [...trail, entry.title])
    }
  }
  walk(config.items, [])
  return [...pages.values()]
}

/**
 * How well a page's title answers the query, or null when it doesn't. Titles that
 * start with the query come first; a match only in the titles above it comes last,
 * and the Legacy area after everything current.
 */
function pageScore(page: Result, query: string): number | null {
  const tokens = query.split(/\s+/).filter(Boolean)
  const title = page.title.toLowerCase()
  const all = `${page.trail.join(' ')} ${page.title}`.toLowerCase()
  if (!tokens.every((token) => all.includes(token))) return null
  let score = 0
  if (title === query) score = 100
  else if (title.startsWith(query)) score = 80
  else if (tokens.every((token) => new RegExp(`(^|\\W)${escape(token)}`).test(title))) score = 60
  else if (tokens.every((token) => title.includes(token))) score = 40
  else score = 10
  // The deeper a page, the more specific: a section's overview before its sub-pages
  score -= page.trail.length
  if (page.trail[0] === 'Legacy') score -= 50
  return score
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function matchingPages(pages: Result[], query: string): Result[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []
  return pages
    .map((page) => ({ page, score: pageScore(page, normalized) }))
    .filter((match): match is { page: Result; score: number } => match.score !== null)
    .sort((a, b) => b.score - a.score || a.page.title.length - b.page.title.length)
    .slice(0, 20)
    .map(({ page }) => page)
}

/** The docs path of a URL the scraper indexed, such as https://tiptap.dev/docs/editor/… */
function toPath(url: string): string {
  const path = url.replace(/^https?:\/\/[^/]+/, '')
  const withoutBase = path.replace(/^\/docs(?=\/|$)/, '') || '/'
  return withoutBase
}

/** Full-text results, one per page, without the pages already listed by title. */
function useFullText(query: string, exclude: Set<string>): Result[] {
  const { refine } = useSearchBox()
  const { items } = useHits<SearchHit & { url: string; objectID: string }>()
  useEffect(() => refine(query), [query, refine])
  return useMemo(
    () =>
      query.trim()
        ? items
            .map((hit) => {
              // The deepest heading names the passage; the ones above it say where it is
              const levels = Object.values(hit.hierarchy ?? {}).filter(Boolean) as string[]
              return {
                key: hit.objectID,
                href: toPath(hit.url),
                title: levels.at(-1) ?? '',
                trail: levels.slice(0, -1),
                hit,
              }
            })
            .filter((result) => !exclude.has(result.href.split('#')[0]))
        : [],
    [items, query, exclude],
  )
}

/** The search field and, while it holds a query, the results in place of the navigation. */
export function SidebarSearch({
  config,
  children,
}: {
  config: SidebarConfig
  children: React.ReactNode
}) {
  const [query, setQuery] = useState(rememberedQuery)
  useEffect(() => {
    rememberedQuery = query
  }, [query])

  const pages = useMemo(() => sidebarPages(config), [config])
  const pageResults = useMemo(() => matchingPages(pages, query), [pages, query])
  const props = { query, setQuery, nav: children, pageResults }
  return hasFullText ? (
    <InstantSearch
      searchClient={typesenseAdapter.searchClient}
      indexName={process.env.NEXT_PUBLIC_DOCSEARCH_INDEX || ''}
    >
      <Configure hitsPerPage={20} />
      <WithFullText {...props} />
    </InstantSearch>
  ) : (
    <SearchBody {...props} textResults={[]} />
  )
}

type BodyProps = {
  query: string
  setQuery: (query: string) => void // eslint-disable-line no-unused-vars
  nav: React.ReactNode
  pageResults: Result[]
}

/** Adds the full-text results, inside InstantSearch. */
function WithFullText(props: BodyProps) {
  const titleHrefs = useMemo(
    () => new Set(props.pageResults.map((page) => page.href)),
    [props.pageResults],
  )
  const textResults = useFullText(props.query, titleHrefs)
  return <SearchBody {...props} textResults={textResults} />
}

function SearchBody({
  query,
  setQuery,
  nav,
  pageResults,
  textResults,
}: BodyProps & { textResults: Result[] }) {
  const results = useMemo(() => [...pageResults, ...textResults], [pageResults, textResults])

  const [active, setActive] = useState(rememberedActive)
  useEffect(() => {
    rememberedActive = active
  }, [active])

  const searching = !!query.trim()
  const router = useRouter()
  const pathname = usePathname()
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(false)
  const scroller = () => list.current?.closest<HTMLElement>('.overflow-auto')

  // Like the navigation, the results keep their scroll position when a page opens
  useLayoutEffect(() => {
    if (!searching) return
    const element = scroller()
    if (!element) return
    element.scrollTo({ top: rememberedScroll })
    if (revealActive) {
      revealActive = false
      list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
    }
    const save = () => (rememberedScroll = element.scrollTop)
    element.addEventListener('scroll', save, { passive: true })
    return () => {
      save()
      element.removeEventListener('scroll', save)
    }
    // Only when the results appear; scrolling while they show is the reader's
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching])

  // The opened page shows the query's words, until the search is cleared
  useEffect(() => {
    // After the page's content has rendered
    const timer = window.setTimeout(() => highlightOnPage(searching ? query : ''), 100)
    return () => window.clearTimeout(timer)
  }, [query, searching, pathname])

  // A new query starts at its first result, at the top
  const previousQuery = useRef(query)
  useEffect(() => {
    if (previousQuery.current === query) return
    previousQuery.current = query
    setActive(0)
    rememberedScroll = 0
    scroller()?.scrollTo({ top: 0 })
  }, [query])

  /** Selects a result by key, and shows it in the list. */
  const select = (index: number) => {
    setActive(index)
    requestAnimationFrame(() =>
      list.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' }),
    )
  }

  /** Opens a result; the list shows it once the page has changed. */
  const open = (index: number) => {
    const result = results[index]
    if (!result) return
    setActive(index)
    revealActive = true
    router.push(result.href)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault()
      select((active + 1) % results.length)
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault()
      select((active - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      open(active)
    } else if (event.key === 'Escape') {
      setQuery('')
    }
  }

  return (
    <>
      {/* Stays on top while the sidebar scrolls */}
      {/* Spans the sidebar's full width, so nothing scrolling below shows at its edges */}
      <div
        className="sticky -top-6 z-20 -mx-2 -mt-6 px-2 pt-2 pb-3 bg-warmGray"
        data-sidebar-search
      >
        <label className="flex items-center h-9 px-2.5 gap-2 bg-white rounded-lg border border-grayAlpha-200 transition-colors hover:border-grayAlpha-400 focus-within:border-purple-500 focus-within:hover:border-purple-500">
          <SearchIcon className="size-4 flex-none text-grayAlpha-400" aria-hidden="true" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search…"
            aria-label="Search the docs"
            aria-controls="sidebar-search-results"
            className="w-full min-w-0 bg-transparent text-sm outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {/* The shortcut shows while the field waits for one */}
          {!searching && !focused ? (
            <kbd className="flex-none flex items-center gap-0.5 px-1 py-0.5 rounded border border-grayAlpha-100 shadow-slim font-sans font-medium text-xs leading-[110%] text-grayAlpha-600">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          ) : null}
          {searching ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                input.current?.focus()
              }}
              className="p-0.5 rounded cursor-pointer hover:bg-neutral-100"
              aria-label="Clear search"
            >
              <XIcon className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </label>
        {searching ? (
          <div className="flex items-center justify-between mt-2 pl-1 text-xs text-grayAlpha-600">
            <span aria-live="polite">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
            {/* Open the previous or next result without going back to the list */}
            <span className="flex items-center">
              <button
                type="button"
                onClick={() => open((active - 1 + results.length) % results.length)}
                disabled={!results.length}
                className="grid place-items-center size-6 rounded-md cursor-pointer hover:bg-grayAlpha-100 disabled:opacity-40"
                aria-label="Open the previous result"
              >
                <ChevronUpIcon className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => open((active + 1) % results.length)}
                disabled={!results.length}
                className="grid place-items-center size-6 rounded-md cursor-pointer hover:bg-grayAlpha-100 disabled:opacity-40"
                aria-label="Open the next result"
              >
                <ChevronDownIcon className="size-4" aria-hidden="true" />
              </button>
            </span>
          </div>
        ) : null}
      </div>
      {searching ? (
        <div id="sidebar-search-results" ref={list} className="flex flex-col gap-4">
          <ResultGroup
            title="Pages"
            results={pageResults}
            offset={0}
            active={active}
            pathname={pathname}
            onSelect={setActive}
          />
          <ResultGroup
            title="In the docs"
            results={textResults}
            offset={pageResults.length}
            active={active}
            pathname={pathname}
            onSelect={setActive}
          />
          {!results.length ? (
            <p className="px-2.5 text-sm text-grayAlpha-600">No results for “{query.trim()}”.</p>
          ) : null}
        </div>
      ) : (
        nav
      )}
    </>
  )
}

function ResultGroup({
  title,
  results,
  offset,
  active,
  pathname,
  onSelect,
}: {
  title: string
  results: Result[]
  offset: number
  active: number
  pathname: string
  onSelect: (index: number) => void // eslint-disable-line no-unused-vars
}) {
  if (!results.length) return null
  return (
    <section aria-label={title} className="flex flex-col gap-1">
      <h2 className="flex items-center justify-between px-2.5 pb-1 text-xs font-semibold uppercase text-grayAlpha-600">
        {title}
        <span className="font-normal">{results.length}</span>
      </h2>
      {results.map((result, i) => {
        const index = offset + i
        const isCurrent = result.href.split('#')[0] === pathname
        return (
          <Link
            key={result.key}
            href={result.href}
            data-index={index}
            onClick={() => onSelect(index)}
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'block px-2.5 py-1.5 rounded-md text-sm no-underline',
              index === active
                ? 'bg-grayAlpha-100 ring-1 ring-grayAlpha-200'
                : 'hover:bg-grayAlpha-100',
              isCurrent ? 'text-purple-600' : 'text-grayAlpha-900',
            )}
          >
            <span className="block truncate text-[13px] font-semibold">{result.title}</span>
            {result.hit ? (
              <Highlight
                hit={result.hit as never}
                attribute="content"
                className="block mt-0.5 text-xs text-grayAlpha-600 line-clamp-2"
              />
            ) : null}
            {result.trail.length ? (
              <span className="block mt-0.5 truncate text-xs text-grayAlpha-500">
                {result.trail.join(' / ')}
              </span>
            ) : null}
          </Link>
        )
      })}
    </section>
  )
}
