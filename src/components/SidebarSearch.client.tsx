'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ListFilterIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Configure, Highlight, InstantSearch, useHits, useSearchBox } from 'react-instantsearch'
import Link from '@/components/Link'
import { ShortcutTooltip } from '@/components/ui/ShortcutTooltip'
import { SearchHit, SidebarConfig, SidebarGroup, SidebarLink } from '@/types'
import { cn } from '@/utils'
import { sidebarSearchAdapter } from '@/utils/search'

// Search in the sidebar: typing replaces the navigation with the results, which stay
// while the reader opens one after the other. Clearing the field brings the navigation
// back as it was. Pages come from the sidebar itself; full text comes from Typesense.

type Entry = Omit<SidebarLink, 'type'> | SidebarGroup

/** A passage of a page that the full-text search found, under one of its headings. */
type Section = { key: string; href: string; heading?: string; hit: SearchHit }

/** A result: one page, with the passages that match on it. */
type Result = {
  key: string
  href: string
  /** The page's own title */
  title: string
  /** What the sidebar calls the page, if that differs */
  label?: string
  trail: string[]
  sections: Section[]
  /** Matches on the page beyond the sections shown */
  more: number
}

/** A row of the list: a page, or one of its sections. */
type Row = { href: string; result: Result; section?: Section }

type GroupedHit = SearchHit & {
  url: string
  objectID: string
  _grouped_hits?: (SearchHit & { url: string; objectID: string })[]
  _group_found?: number
}

// Like the open entries of the sidebar, the search lives for the whole visit
let rememberedQuery = ''
let rememberedActive = 0
let rememberedScroll = 0
let rememberedAreas: string[] = []
// Set when the reader opens a result by key or arrow, so the list shows it after the page changes
let revealActive = false
const revealOnNextPage = () => (revealActive = true)
// The page a result opened by key leads to; the sidebar can mount anew there, and the field keeps focus
let focusOnPage: string | undefined
const keepFocusOn = (path: string) => (focusOnPage = path)

const hasFullText = !!process.env.NEXT_PUBLIC_DOCSEARCH_HOST

const PAGE_HIGHLIGHT = 'sidebar-search'
const CURRENT_HIGHLIGHT = 'sidebar-search-current'

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** The query's terms in lower case; a "quoted phrase" stays one term. */
function searchTerms(query: string): string[] {
  return [...query.toLowerCase().matchAll(/"([^"]+)"|(\S+)/g)]
    .map(([, phrase, word]) => (phrase ?? word).replaceAll('"', '').trim())
    .filter(Boolean)
}

// A letter or digit, so a term only matches where a word starts
const WORD = '[\\p{L}\\p{N}_]'

/**
 * Where the terms appear in text: at the start of a word, so "ai" doesn't mark
 * "maintain". Terms of two letters, such as "ai" or "id", only match whole words.
 */
function termPattern(terms: string[]): RegExp | undefined {
  const parts = terms
    .filter((term) => term.length > 1)
    .sort((a, b) => b.length - a.length)
    .map((term) => {
      const text = escape(term).replace(/\s+/g, '\\s+')
      return `(?<!${WORD})${text}${term.length <= 2 ? `(?!${WORD})` : ''}`
    })
  return parts.length ? new RegExp(parts.join('|'), 'giu') : undefined
}

/** The query's occurrences in the page's content, in reading order. */
function findOnPage(query: string): Range[] {
  const pattern = termPattern(searchTerms(query))
  const root = document.querySelector('main')
  if (!pattern || !root) return []
  const ranges: Range[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node && ranges.length < 500; node = walker.nextNode()) {
    const matches = [...(node as Text).data.matchAll(pattern)]
    // Text in a closed tab or a collapsed block can't be shown
    if (!matches.length || node.parentElement?.checkVisibility?.() === false) continue
    for (const match of matches) {
      const range = new Range()
      range.setStart(node, match.index)
      range.setEnd(node, match.index + match[0].length)
      ranges.push(range)
    }
  }
  return ranges
}

/**
 * Paints ranges as a browser's find does, without changing the page's markup: the
 * CSS Custom Highlight API draws them, and a browser without it shows none.
 */
function paint(name: string, ranges: Range[], priority = 0) {
  const registry = typeof CSS !== 'undefined' ? CSS.highlights : undefined
  // The browser's Highlight, not the search's component of the same name
  const PageHighlight = globalThis.Highlight
  if (!registry || !PageHighlight) return
  if (!ranges.length) {
    registry.delete(name)
    return
  }
  const highlight = new PageHighlight(...ranges)
  highlight.priority = priority
  registry.set(name, highlight)
}

/** The first occurrence at or after the section the URL points to, or the first one. */
function firstAfterHash(ranges: Range[]): number {
  const id = decodeURIComponent(window.location.hash.slice(1))
  const target = id ? document.getElementById(id) : null
  if (!target) return 0
  const index = ranges.findIndex(
    (range) =>
      !!(target.compareDocumentPosition(range.startContainer) & Node.DOCUMENT_POSITION_FOLLOWING),
  )
  return index === -1 ? 0 : index
}

/** Focuses the sidebar's search field if it is on screen; false where it isn't, such as on phones. */
export function focusSidebarSearch(): boolean {
  const field = document.querySelector<HTMLInputElement>('[data-sidebar-search] input')
  if (!field || field.offsetParent === null) return false
  field.focus()
  field.select()
  return true
}

/** Every page in the sidebar, under its own title, with the titles above it. */
function sidebarPages(config: SidebarConfig): Map<string, Result> {
  const pages = new Map<string, Result>()
  const walk = (entries: Entry[], trail: string[]) => {
    for (const entry of entries) {
      const isGroup = 'type' in entry && entry.type === 'group'
      const link = entry as Omit<SidebarLink, 'type'>
      if (entry.href && !isGroup && !link.external && !pages.has(entry.href)) {
        const title = link.pageTitle ?? entry.title
        pages.set(entry.href, {
          key: entry.href,
          href: entry.href,
          title,
          label: title === entry.title ? undefined : entry.title,
          trail,
          sections: [],
          more: 0,
        })
      }
      if (entry.children) walk(entry.children, [...trail, entry.title])
    }
  }
  walk(config.items, [])
  return pages
}

/** How well one title answers the query's terms. */
function titleScore(title: string, phrase: string, terms: string[]): number {
  const text = title.toLowerCase()
  if (text === phrase) return 100
  if (text.startsWith(phrase)) return 80
  if (terms.every((term) => new RegExp(`(^|\\W)${escape(term)}`).test(text))) return 60
  if (terms.every((term) => text.includes(term))) return 40
  return 10
}

/**
 * How well a page answers the query, or null when it doesn't. Its own title and the
 * sidebar's label both count; titles that start with the query come first, a match
 * only in the titles above it comes last, and the Legacy area after everything current.
 */
function pageScore(page: Result, terms: string[]): number | null {
  const titles = [page.title, page.label].filter((title): title is string => !!title)
  const all = [...page.trail, ...titles].join(' ').toLowerCase()
  if (!terms.every((term) => all.includes(term))) return null
  const phrase = terms.join(' ')
  // The deeper a page, the more specific: a section's overview before its sub-pages
  let score = Math.max(...titles.map((title) => titleScore(title, phrase, terms)))
  score -= page.trail.length
  if (page.trail[0] === 'Legacy') score -= 50
  return score
}

function matchingPages(pages: Map<string, Result>, query: string): Result[] {
  const terms = searchTerms(query)
  if (!terms.length) return []
  return [...pages.values()]
    .map((page) => ({ page, score: pageScore(page, terms) }))
    .filter((match): match is { page: Result; score: number } => match.score !== null)
    .sort((a, b) => b.score - a.score || a.page.title.length - b.page.title.length)
    .slice(0, 20)
    .map(({ page }) => page)
}

/** The docs path of a URL the scraper indexed, such as https://tiptap.dev/docs/editor/… */
function toPath(url: string): string {
  const path = url.replace(/^https?:\/\/[^/]+/, '')
  return path.replace(/^\/docs(?=\/|$)/, '') || '/'
}

/** A page's matching passages, one per heading. */
function sectionsOf(hit: GroupedHit, pageTitle: string): Section[] {
  const sections = new Map<string, Section>()
  for (const passage of hit._grouped_hits ?? [hit]) {
    const href = toPath(passage.url)
    if (sections.has(href)) continue
    // The deepest heading names the passage, unless it is the page's own title
    const heading = (Object.values(passage.hierarchy ?? {}).filter(Boolean) as string[]).at(-1)
    sections.set(href, {
      key: passage.objectID,
      href,
      heading: heading && heading !== pageTitle && href.includes('#') ? heading : undefined,
      hit: passage,
    })
  }
  return [...sections.values()]
}

/** The deepest sidebar page a URL lies below, for pages the sidebar doesn't list. */
function parentPage(pages: Map<string, Result>, href: string): Result | undefined {
  let parent: Result | undefined
  for (const page of pages.values()) {
    if (page.href === '/' || !href.startsWith(`${page.href}/`)) continue
    if (!parent || page.href.length > parent.href.length) parent = page
  }
  return parent
}

/** The top-level area of the sidebar a result is in, such as "Features". */
const areaOf = (result: Result) => result.trail[0] ?? 'Other'

/**
 * Full-text results, one per page, merged into the pages found by title: those keep
 * their place and gain the passages, the others follow.
 */
function useFullText(query: string, pages: Map<string, Result>, byTitle: Result[]): Result[] {
  const { refine } = useSearchBox()
  const { items } = useHits<GroupedHit>()
  useEffect(() => refine(query), [query, refine])
  return useMemo(() => {
    if (!query.trim()) return []
    const results = new Map(byTitle.map((page) => [page.href, { ...page }]))
    for (const hit of items) {
      const href = toPath(hit.url).split('#')[0]
      const levels = Object.values(hit.hierarchy ?? {}).filter(Boolean) as string[]
      const known = results.get(href) ?? pages.get(href)
      const parent = known ? undefined : parentPage(pages, href)
      const page = known ?? {
        key: href,
        href,
        title: hit.hierarchy?.lvl1 ?? levels[0] ?? href,
        // Where the sidebar has it, so it falls in the right area
        trail: parent
          ? [...parent.trail, parent.label ?? parent.title]
          : hit.hierarchy?.lvl1
            ? [hit.hierarchy.lvl0]
            : [],
        sections: [],
        more: 0,
      }
      const sections = sectionsOf(hit, page.title)
      results.set(href, {
        ...page,
        sections,
        more: Math.max(0, (hit._group_found ?? 0) - (hit._grouped_hits?.length ?? 1)),
      })
    }
    return [...results.values()]
  }, [items, query, pages, byTitle])
}

/**
 * Where two results share a title, the part of their trail that tells them apart,
 * such as "DOCX" for one of several "Editor extension" pages.
 */
function distinguishers(results: Result[]): Map<Result, string> {
  const byTitle = new Map<string, Result[]>()
  for (const result of results) {
    const title = result.title.toLowerCase()
    byTitle.set(title, [...(byTitle.get(title) ?? []), result])
  }
  const names = new Map<Result, string>()
  for (const same of byTitle.values()) {
    if (same.length < 2) continue
    for (const result of same) {
      const others = same.filter((other) => other !== result)
      // The deepest part no other one has, or else one not all of them share
      const segment =
        result.trail.findLast((part) => !others.some((other) => other.trail.includes(part))) ??
        result.trail.findLast((part) => !others.every((other) => other.trail.includes(part)))
      if (segment) names.set(result, segment)
    }
  }
  return names
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
  const byTitle = useMemo(() => matchingPages(pages, query), [pages, query])
  const areaOrder = useMemo(() => config.items.map((item) => item.title), [config])
  const props = { query, setQuery, nav: children, areaOrder }
  return hasFullText ? (
    <InstantSearch
      searchClient={sidebarSearchAdapter.searchClient}
      indexName={process.env.NEXT_PUBLIC_DOCSEARCH_INDEX || ''}
    >
      <Configure hitsPerPage={20} />
      <WithFullText {...props} pages={pages} byTitle={byTitle} />
    </InstantSearch>
  ) : (
    <SearchBody {...props} results={byTitle} />
  )
}

type BodyProps = {
  query: string
  setQuery: (query: string) => void // eslint-disable-line no-unused-vars
  nav: React.ReactNode
  /** The sidebar's top-level areas, in its order */
  areaOrder: string[]
}

/** Adds the full-text results, inside InstantSearch. */
function WithFullText({
  pages,
  byTitle,
  ...props
}: BodyProps & { pages: Map<string, Result>; byTitle: Result[] }) {
  const results = useFullText(props.query, pages, byTitle)
  return <SearchBody {...props} results={results} />
}

const arrowButton =
  'grid flex-none place-items-center size-6 rounded-md cursor-pointer hover:bg-grayAlpha-100 disabled:opacity-40'
const smallArrowButton =
  'grid flex-none place-items-center size-5 rounded cursor-pointer text-grayAlpha-600 hover:bg-grayAlpha-200 hover:text-grayAlpha-900'

function SearchBody({
  query,
  setQuery,
  nav,
  areaOrder,
  results: allResults,
}: BodyProps & { results: Result[] }) {
  // The areas the reader narrowed the results to; none means all
  const [areas, setAreas] = useState<string[]>(rememberedAreas)
  useEffect(() => {
    rememberedAreas = areas
  }, [areas])
  // A cleared search starts again in all areas
  const changeQuery = (next: string) => {
    if (!next.trim()) setAreas([])
    setQuery(next)
  }
  const results = useMemo(
    () =>
      areas.length ? allResults.filter((result) => areas.includes(areaOf(result))) : allResults,
    [allResults, areas],
  )
  // Each area with results, in the sidebar's order, and the chosen ones even without
  const areaCounts = useMemo(() => {
    const counts = new Map<string, number>(areas.map((area) => [area, 0]))
    for (const result of allResults) {
      counts.set(areaOf(result), (counts.get(areaOf(result)) ?? 0) + 1)
    }
    const rank = (area: string) => (areaOrder.indexOf(area) + 1 || Infinity) as number
    return [...counts].sort(([a], [b]) => rank(a) - rank(b))
  }, [allResults, areas, areaOrder])

  // Pages and their sections, in the order the arrow keys move through them
  const rows = useMemo(
    () =>
      results.flatMap((result): Row[] => [
        { href: result.href, result },
        ...result.sections.map((section) => ({ href: section.href, result, section })),
      ]),
    [results],
  )
  const pageRows = useMemo(() => rows.flatMap((row, index) => (row.section ? [] : [index])), [rows])
  const names = useMemo(() => distinguishers(results), [results])

  const [active, setActive] = useState(rememberedActive)
  useEffect(() => {
    rememberedActive = active
  }, [active])

  const searching = !!query.trim()
  const isPhrase = /^\s*"[^"]+"\s*$/.test(query)
  const router = useRouter()
  const pathname = usePathname()
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(false)
  const header = useRef<HTMLDivElement>(null)
  const scroller = () => header.current?.closest<HTMLElement>('.overflow-auto')

  // Once the sidebar scrolls, a line sets the field apart from what passes below it
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const element = scroller()
    if (!element) return
    const update = () => setScrolled(element.scrollTop > 0)
    update()
    element.addEventListener('scroll', update, { passive: true })
    return () => element.removeEventListener('scroll', update)
  }, [])

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

  // Typing goes on where it stopped when a key opened the page
  useEffect(() => {
    if (focusOnPage === pathname) input.current?.focus()
    keepFocusOn('')
    // Only when the sidebar mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The query's occurrences on the open page, and the one the reader is at
  const occurrences = useRef<Range[]>([])
  const [count, setCount] = useState(0)
  const [current, setCurrent] = useState(0)

  const showOccurrence = useCallback((index: number, scroll: boolean) => {
    const range = occurrences.current[index]
    setCurrent(index)
    paint(CURRENT_HIGHLIGHT, range ? [range] : [], 1)
    if (range && scroll) {
      range.startContainer.parentElement?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [])

  /** Starts at the first occurrence in the section the URL points to. */
  const syncToHash = useCallback(
    () => showOccurrence(firstAfterHash(occurrences.current), false),
    [showOccurrence],
  )

  // The opened page shows the query's words, until the search is cleared
  useEffect(() => {
    // After the page's content has rendered
    const timer = window.setTimeout(() => {
      occurrences.current = searching ? findOnPage(query) : []
      setCount(occurrences.current.length)
      paint(PAGE_HIGHLIGHT, occurrences.current)
      syncToHash()
    }, 100)
    return () => window.clearTimeout(timer)
  }, [query, searching, pathname, syncToHash])

  const step = (by: number) => {
    if (!count) return
    showOccurrence((current + by + count) % count, true)
  }

  // A new query starts at its first result, at the top
  const previousQuery = useRef(query)
  useEffect(() => {
    if (previousQuery.current === query) return
    previousQuery.current = query
    setActive(0)
    rememberedScroll = 0
    scroller()?.scrollTo({ top: 0 })
  }, [query])

  /** Narrows the results to some areas, starting again at the first one. */
  const changeAreas = (next: string[]) => {
    setAreas(next)
    setActive(0)
  }

  /** Selects a row by key, and shows it in the list. */
  const select = (index: number) => {
    setActive(index)
    requestAnimationFrame(() =>
      list.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' }),
    )
  }

  /** Whether a row leads to where the reader already is. */
  const isOpen = (row: Row) => {
    const [path, hash] = row.href.split('#')
    return path === pathname && (!hash || window.location.hash === `#${hash}`)
  }

  /** Opens a row; the list shows it once the page has changed. */
  const open = (index: number) => {
    const row = rows[index]
    if (!row) return
    setActive(index)
    revealOnNextPage()
    router.push(row.href)
    // On the same page, the occurrences stay; they start again at the section
    if (row.href.split('#')[0] === pathname) window.setTimeout(syncToHash, 100)
  }

  /** A click opens the row here; with a modifier key, the browser opens it elsewhere. */
  const onRowClick = (event: React.MouseEvent, index: number) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    open(index)
  }

  /** Opens the previous or next page, skipping the sections in between. */
  const openPage = (by: number) => {
    if (!pageRows.length) return
    const at = pageRows.findLastIndex((index) => index <= active)
    open(pageRows[(at + by + pageRows.length) % pageRows.length])
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && rows.length) {
      event.preventDefault()
      select((active + 1) % rows.length)
    } else if (event.key === 'ArrowUp' && rows.length) {
      event.preventDefault()
      select((active - 1 + rows.length) % rows.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      // Where the reader already is, Enter steps through the occurrences, as a browser's find does
      if (rows[active] && isOpen(rows[active]) && count) step(event.shiftKey ? -1 : 1)
      else {
        keepFocusOn(rows[active]?.href.split('#')[0] ?? '')
        open(active)
      }
    } else if (event.key === 'Escape') {
      changeQuery('')
    }
  }

  return (
    <>
      {/* Stays on top while the sidebar scrolls */}
      {/* Spans the sidebar's full width, so nothing scrolling below shows at its edges */}
      <div
        ref={header}
        className={cn(
          'sticky -top-6 z-20 -mx-2 -mt-6 px-2 pt-2 pb-3 bg-warmGray border-b transition-colors',
          scrolled ? 'border-grayAlpha-200' : 'border-transparent',
        )}
        data-sidebar-search
      >
        <label className="flex items-center h-9 pl-2.5 pr-1.5 gap-2 bg-white rounded-lg border border-grayAlpha-200 transition-colors hover:border-grayAlpha-400 focus-within:border-purple-500 focus-within:hover:border-purple-500">
          <SearchIcon className="size-4 flex-none text-grayAlpha-400" aria-hidden="true" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
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
            <ShortcutTooltip shortcuts={[['Clear search', ['esc']]]}>
              <button
                type="button"
                onClick={() => {
                  changeQuery('')
                  input.current?.focus()
                }}
                className={arrowButton}
                aria-label="Clear search"
              >
                <XIcon className="size-3.5" aria-hidden="true" />
              </button>
            </ShortcutTooltip>
          ) : null}
        </label>
        {searching ? (
          <div className="mt-2 pl-1 text-xs text-grayAlpha-600">
            <div className="flex items-center justify-between pr-1.5">
              <span className="flex items-center gap-2">
                <span aria-live="polite">
                  {areas.length ? `${results.length} of ${allResults.length}` : results.length}{' '}
                  {allResults.length === 1 ? 'page' : 'pages'}
                </span>
                {/* Puts the query in quotes, so readers see how to search a phrase themselves */}
                {isPhrase || searchTerms(query).length > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      changeQuery(isPhrase ? query.replaceAll('"', '') : `"${query.trim()}"`)
                    }
                    aria-pressed={isPhrase}
                    className={cn(
                      'px-1.5 py-0.5 rounded-md border cursor-pointer transition-colors',
                      isPhrase
                        ? 'border-purple-200 bg-purple-50 text-purple-700'
                        : 'border-grayAlpha-200 hover:border-grayAlpha-400 hover:text-grayAlpha-900',
                    )}
                  >
                    Exact phrase
                  </button>
                ) : null}
              </span>
              {/* Open the previous or next page without going back to the list */}
              <span className="flex items-center">
                <AreaFilter counts={areaCounts} chosen={areas} onChange={changeAreas} />
                <ShortcutTooltip
                  shortcuts={[
                    ['Open the previous or next page'],
                    ['Choose a result', ['↑', '↓']],
                    ['Open it', ['↵']],
                  ]}
                >
                  <button
                    type="button"
                    onClick={() => openPage(-1)}
                    disabled={!results.length}
                    className={arrowButton}
                    aria-label="Open the previous page"
                  >
                    <ChevronUpIcon className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openPage(1)}
                    disabled={!results.length}
                    className={arrowButton}
                    aria-label="Open the next page"
                  >
                    <ChevronDownIcon className="size-4" aria-hidden="true" />
                  </button>
                </ShortcutTooltip>
              </span>
            </div>
          </div>
        ) : null}
      </div>
      {searching ? (
        <div id="sidebar-search-results" ref={list} className="flex flex-col gap-1">
          {results.map((result) => {
            const index = rows.findIndex((row) => row.result === result && !row.section)
            const isCurrent = result.href === pathname
            const name = names.get(result)
            return (
              <div key={result.key} className="relative">
                <Link
                  href={result.href}
                  data-index={index}
                  onClick={(event) => onRowClick(event, index)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'block px-2.5 py-1.5 rounded-md text-sm no-underline',
                    index === active
                      ? 'bg-grayAlpha-100 ring-1 ring-grayAlpha-200'
                      : 'hover:bg-grayAlpha-100',
                    isCurrent ? 'text-purple-600' : 'text-grayAlpha-900',
                  )}
                >
                  <span className="block truncate text-[13px] font-semibold">
                    {name ? (
                      <span className="font-normal text-grayAlpha-500">{name} · </span>
                    ) : null}
                    {result.title}
                  </span>
                  {/* On the open page, the matches there take the trail's place, so nothing moves */}
                  {isCurrent && count ? (
                    <span className="block mt-0.5 text-xs text-grayAlpha-600">On this page</span>
                  ) : result.trail.length ? (
                    <span className="block mt-0.5 truncate text-xs text-grayAlpha-500">
                      {result.trail.join(' / ')}
                    </span>
                  ) : null}
                </Link>
                {/* Beside the link rather than in it, so a click steps instead of opening */}
                {isCurrent && count ? (
                  <span className="absolute right-1 bottom-1 flex">
                    <ShortcutTooltip
                      shortcuts={[
                        ['Next match', ['↵']],
                        ['Previous match', ['⇧', '↵']],
                      ]}
                    >
                      <button
                        type="button"
                        onClick={() => step(-1)}
                        className={smallArrowButton}
                        aria-label="Previous match on this page"
                      >
                        <ChevronLeftIcon className="size-3.5" aria-hidden="true" />
                      </button>
                      <span
                        aria-live="polite"
                        className="self-center px-0.5 text-xs tabular-nums text-grayAlpha-600"
                      >
                        {current + 1} / {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => step(1)}
                        className={smallArrowButton}
                        aria-label="Next match on this page"
                      >
                        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
                      </button>
                    </ShortcutTooltip>
                  </span>
                ) : null}
                {result.sections.length ? (
                  <div className="flex flex-col gap-0.5 mt-0.5 ml-2.5 pl-1.5 border-l border-grayAlpha-200">
                    {result.sections.map((section) => {
                      const sectionIndex = rows.findIndex((row) => row.section === section)
                      return (
                        <Link
                          key={section.key}
                          href={section.href}
                          data-index={sectionIndex}
                          onClick={(event) => onRowClick(event, sectionIndex)}
                          className={cn(
                            'block px-2 py-1 rounded-md no-underline text-grayAlpha-900',
                            sectionIndex === active
                              ? 'bg-grayAlpha-100 ring-1 ring-grayAlpha-200'
                              : 'hover:bg-grayAlpha-100',
                          )}
                        >
                          {section.heading ? (
                            <span className="block truncate text-xs font-medium">
                              {section.heading}
                            </span>
                          ) : null}
                          <Highlight
                            hit={section.hit as never}
                            attribute="content"
                            className="block text-xs text-grayAlpha-600 line-clamp-2"
                          />
                        </Link>
                      )
                    })}
                    {result.more ? (
                      <span className="px-2 py-0.5 text-xs text-grayAlpha-500">
                        +{result.more} more on this page
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
          {!results.length ? (
            <p className="px-2.5 text-sm text-grayAlpha-600">
              No results for “{query.trim()}”
              {areas.length ? (
                <>
                  {' '}
                  in {areas.join(', ')}.{' '}
                  <button
                    type="button"
                    onClick={() => changeAreas([])}
                    className="underline cursor-pointer hover:text-grayAlpha-900"
                  >
                    Search all areas
                  </button>
                </>
              ) : (
                '.'
              )}
            </p>
          ) : null}
        </div>
      ) : (
        nav
      )}
    </>
  )
}

/** Narrows the results to some of the sidebar's areas, each with its number of results. */
function AreaFilter({
  counts,
  chosen,
  onChange,
}: {
  counts: [string, number][]
  chosen: string[]
  onChange: (areas: string[]) => void // eslint-disable-line no-unused-vars
}) {
  const toggle = (area: string) =>
    onChange(chosen.includes(area) ? chosen.filter((a) => a !== area) : [...chosen, area])
  return (
    <DropdownMenu.Root modal={false}>
      <ShortcutTooltip shortcuts={[['Filter by area']]}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            disabled={counts.length < 2 && !chosen.length}
            className={cn(arrowButton, 'relative', chosen.length ? 'text-purple-600' : undefined)}
            aria-label={chosen.length ? `Filter by area: ${chosen.join(', ')}` : 'Filter by area'}
          >
            <ListFilterIcon className="size-4" aria-hidden="true" />
            {chosen.length ? (
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-purple-600" />
            ) : null}
          </button>
        </DropdownMenu.Trigger>
      </ShortcutTooltip>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-48 p-1 bg-white border rounded-lg border-grayAlpha-100 shadow-lg text-[13px]"
        >
          {counts.map(([area, count]) => (
            <DropdownMenu.CheckboxItem
              key={area}
              checked={chosen.includes(area)}
              onCheckedChange={() => toggle(area)}
              // The menu stays open, so several areas can be chosen
              onSelect={(event) => event.preventDefault()}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer outline-none data-highlighted:bg-grayAlpha-100"
            >
              <span
                className={cn(
                  'grid place-items-center size-3.5 rounded border',
                  chosen.includes(area)
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-grayAlpha-300 bg-white',
                )}
              >
                <DropdownMenu.ItemIndicator>
                  <CheckIcon className="size-2.5" strokeWidth={3} aria-hidden="true" />
                </DropdownMenu.ItemIndicator>
              </span>
              <span className="flex-1">{area}</span>
              <span className="text-xs tabular-nums text-grayAlpha-500">{count}</span>
            </DropdownMenu.CheckboxItem>
          ))}
          {chosen.length ? (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-grayAlpha-100" />
              <DropdownMenu.Item
                onSelect={() => onChange([])}
                className="px-2 py-1.5 rounded-md cursor-pointer outline-none text-grayAlpha-600 data-highlighted:bg-grayAlpha-100"
              >
                Show all areas
              </DropdownMenu.Item>
            </>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
