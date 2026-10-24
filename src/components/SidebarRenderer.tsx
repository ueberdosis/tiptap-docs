'use client'

import { ChevronRightIcon, ExternalLinkIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Tag } from './ui/Tag'
import Link from '@/components/Link'
import { SidebarConfig, SidebarGroup, SidebarLink } from '@/types'
import { Sidebar } from '@/components/ui/Sidebar'
import { cn } from '@/utils'
import { isNew } from '@/utils/isNew'

export const DocsSidebar = ({
  config,
  onItemClick,
}: {
  config: SidebarConfig
  onItemClick?: () => void
}) => {
  const listed = useMemo(() => collectHrefs(config.items), [config.items])
  const track = useRef<HTMLDivElement>(null)
  useKeptScroll(track, onItemClick ? 'mobile' : 'desktop')

  return (
    <ListedPages.Provider value={listed}>
      <Sidebar.Track className="gap-0" ref={track}>
        {config.items.map((item, i) =>
          item.type === 'link' ? (
            <LinkItem
              link={item}
              path={item.title}
              key={`${item.href}-${i}`}
              onClick={onItemClick}
            />
          ) : (
            <Fragment key={`${item.href}-${i}`}>
              {item.divider ? <hr className="my-3 mx-2.5 border-grayAlpha-200" /> : null}
              <GroupItem group={item} onClick={onItemClick} />
            </Fragment>
          ),
        )}
      </Sidebar.Track>
    </ListedPages.Provider>
  )
}

type Item = Omit<SidebarLink, 'type'> | SidebarGroup | SidebarLink

// The sidebar renders again with every page. What the reader opened or closed, and how far they
// scrolled, lives here for the whole visit, so moving between pages keeps the sidebar as it was.
const rememberedOpen = new Map<string, boolean>()
const rememberedScroll = new Map<string, number>()

// eslint-disable-next-line no-unused-vars
type SetOpen = (next: boolean | ((prev: boolean) => boolean)) => void

/** Open state that survives navigation. A page inside the entry always opens it. */
function useRememberedOpen(key: string, mustOpen: boolean, initial: boolean): [boolean, SetOpen] {
  const [isOpen, setIsOpenState] = useState(() =>
    mustOpen ? true : (rememberedOpen.get(key) ?? initial),
  )
  const setIsOpen = useCallback<SetOpen>(
    (next) =>
      setIsOpenState((prev) => {
        const value = typeof next === 'function' ? next(prev) : next
        rememberedOpen.set(key, value)
        return value
      }),
    [key],
  )
  return [isOpen, setIsOpen]
}

/** Keeps the scroll position of the sidebar's scrolling container across pages. */
function useKeptScroll(track: React.RefObject<HTMLElement | null>, key: string) {
  useLayoutEffect(() => {
    let scroller: HTMLElement | null = track.current?.parentElement ?? null
    while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)) {
      scroller = scroller.parentElement
    }
    if (!scroller) return
    const element = scroller
    const saved = rememberedScroll.get(key)
    if (saved !== undefined) element.scrollTo({ top: saved })
    const save = () => rememberedScroll.set(key, element.scrollTop)
    element.addEventListener('scroll', save, { passive: true })
    // Also when the page changes, in case no scroll event came since the last scroll
    return () => {
      save()
      element.removeEventListener('scroll', save)
    }
  }, [track, key])
}

function collectHrefs(items: Item[], out = new Set<string>()): Set<string> {
  for (const item of items) {
    if (item.href) out.add(item.href)
    if (item.children) collectHrefs(item.children, out)
  }
  return out
}

/** The arrow that folds an entry open, on the left of its text like in a file tree. */
const FoldArrow = ({ isOpen }: { isOpen: boolean }) => (
  <ChevronRightIcon
    className={cn(
      'size-3 text-grayAlpha-500 transition-transform duration-150',
      isOpen ? 'rotate-90' : undefined,
    )}
    strokeWidth={2.75}
    aria-hidden="true"
  />
)

// One label per entry, the one that matters most for whether to open it:
// end of life first, then upcoming, then the plan, then new pages. Open source
// stays unlabeled. Alpha and Beta change how you build on a page, not whether you
// open it, so they show in the page header and the catalog instead.
export type SidebarLabel = { text: string; kind: 'plan' | 'status' | 'end-of-life' }

const LABELS: Record<string, SidebarLabel & { rank: number }> = {
  deprecated: { text: 'Deprecated', kind: 'end-of-life', rank: 0 },
  legacy: { text: 'Legacy', kind: 'end-of-life', rank: 1 },
  soon: { text: 'Soon', kind: 'status', rank: 2 },
  start: { text: 'Start', kind: 'plan', rank: 3 },
  team: { text: 'Team', kind: 'plan', rank: 3 },
  business: { text: 'Business', kind: 'plan', rank: 3 },
  'add-on': { text: 'Add-on', kind: 'plan', rank: 3 },
  'pilot program': { text: 'Pilot', kind: 'plan', rank: 3 },
  // Only where everything around is paid, such as Hocuspocus under Documents
  'open source': { text: 'Open source', kind: 'status', rank: 3 },
  new: { text: 'New', kind: 'status', rank: 4 },
}

/** The label an entry shows, the most important one if it has several. */
export function sidebarLabel(tags: string[] | undefined): SidebarLabel | undefined {
  const [label] = (tags ?? [])
    .map((tag) => LABELS[tag.toLowerCase()])
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank)
  return label ? { text: label.text, kind: label.kind } : undefined
}

const LABEL_VARIANT = { plan: 'info', status: 'gray', 'end-of-life': 'hint' } as const

const LabelTag = ({ label, className }: { label: SidebarLabel; className?: string }) => (
  <Tag className={cn('select-none', className)} variant={LABEL_VARIANT[label.kind]} size="small">
    {label.text}
  </Tag>
)

/** Shows the full title on hover, but only when it doesn't fit. */
function showTitleIfCut(event: React.MouseEvent<HTMLElement>) {
  const element = event.currentTarget
  if (element.scrollWidth > element.clientWidth) element.title = element.textContent ?? ''
  else element.removeAttribute('title')
}

/** Every href in the sidebar. A page that has its own entry opens only the entries above it. */
const ListedPages = createContext<Set<string>>(new Set())

/**
 * Whether the page is `href` or, for a page without its own entry, lies below it.
 * An entry that only folds open (`href: ''`) never matches.
 */
function isAtOrBelow(pathname: string, href: string, listed: Set<string>): boolean {
  if (href === '') return false
  if (pathname === href) return true
  if (href === '/' || listed.has(pathname)) return false
  return pathname.startsWith(`${href}/`)
}

/**
 * Where an entry leads: its own page or, for an entry that only folds open, the page of its
 * first entry, so that a click always shows something. An entry whose first entry has no page
 * yet only folds.
 */
function targetOf(link: Omit<SidebarLink, 'type'>): string {
  if (link.href) return link.href
  const [first] = link.children ?? []
  return first && !first.disabled ? targetOf(first) : ''
}

function hasActiveDescendant(
  children: Omit<SidebarLink, 'type'>[] | undefined,
  pathname: string,
  listed: Set<string>,
): boolean {
  if (!children) return false
  return children.some(
    (child) =>
      isAtOrBelow(pathname, child.href, listed) ||
      hasActiveDescendant(child.children, pathname, listed),
  )
}

export const LinkItem = ({
  link,
  path,
  onClick,
}: {
  link: Omit<SidebarLink, 'type'>
  /** The titles above the entry and its own, which name it for the remembered open state. */
  path: string
  onClick?: () => void
}) => {
  const pathname = usePathname()
  const listed = useContext(ListedPages)
  const isExactMatch = link.isActive ?? pathname === link.href
  const isActiveParent = isAtOrBelow(pathname, link.href, listed)
  const hasActiveChild = hasActiveDescendant(link.children, pathname, listed)
  const isActive = isExactMatch && !hasActiveChild
  const linkRef = useRef<HTMLDivElement>(null)
  const label = sidebarLabel(isNew(link.newSince) ? [...(link.tags ?? []), 'New'] : link.tags)
  const target = targetOf(link)

  const [isOpen, setIsOpen] = useRememberedOpen(
    path,
    isActive || isActiveParent || hasActiveChild,
    false,
  )

  const toggleOpen = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen((prev) => !prev)
    },
    [setIsOpen],
  )

  useEffect(() => {
    if ((isActive || isActiveParent) && link.href !== '') {
      setIsOpen(true)
    }
  }, [isActive, isActiveParent, link.href, setIsOpen])

  // Scroll active item into view when sidebar is fully rendered
  useEffect(() => {
    if (isActive && linkRef.current) {
      linkRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [isActive])

  return (
    <div ref={linkRef}>
      {link.disabled ? (
        <Sidebar.Button
          isActive={false}
          className="pl-5 text-left opacity-40 cursor-default pointer-events-none"
        >
          <span className="flex-grow min-w-0 truncate">{link.title}</span>
          {label ? <LabelTag label={label} className="flex-none ml-2" /> : null}
        </Sidebar.Button>
      ) : (
        <Sidebar.Button
          asChild
          isActive={isActive}
          className="relative pl-5"
          // An entry with a page opens as well, so its entries show next to the page
          onClick={target === '' ? toggleOpen : link.children ? () => setIsOpen(true) : undefined}
        >
          <Link
            href={target}
            onClick={onClick}
            className="flex items-center justify-between w-full"
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            {link.children ? (
              <button
                type="button"
                className="absolute left-0.5 inset-y-0 grid place-items-center w-4"
                onClick={toggleOpen}
                aria-expanded={isOpen}
                aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${link.title}`}
              >
                <FoldArrow isOpen={isOpen} />
              </button>
            ) : null}
            <span className="flex-grow min-w-0 truncate" onMouseEnter={showTitleIfCut}>
              {link.title}
            </span>
            <span className="flex-none flex gap-1 items-center ml-2">
              {link.external && <ExternalLinkIcon className="size-3.5 text-grayAlpha-400" />}
              {label ? <LabelTag label={label} /> : null}
            </span>
          </Link>
        </Sidebar.Button>
      )}
      {/* Closed entries render no children: the global sidebar holds several hundred links */}
      {link.children && isOpen ? (
        // The next level starts with a line under the fold arrow of its parent
        <div className="my-1 ml-[0.5625rem] pl-1 space-y-0.5 border-l border-grayAlpha-200">
          {link.children.map((child, i) => (
            <LinkItem
              link={child}
              path={`${path}/${child.title}`}
              key={`${link.href}-child-${child.href}-${i}`}
              onClick={onClick}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export const GroupItem = ({ group, onClick }: { group: SidebarGroup; onClick?: () => void }) => {
  const pathname = usePathname()
  const holdsPage = hasActiveDescendant(group.children, pathname, useContext(ListedPages))
  const [isOpen, setIsOpen] = useRememberedOpen(
    group.title,
    holdsPage,
    !group.collapsible || !!group.defaultOpen,
  )
  // Open the group that holds the page after a client-side navigation
  const [openedFor, setOpenedFor] = useState(pathname)
  if (openedFor !== pathname) {
    setOpenedFor(pathname)
    if (holdsPage) setIsOpen(true)
  }

  const label = sidebarLabel(group.tags)
  const tags = label ? <LabelTag label={label} className="flex-none" /> : null

  // Folded groups sit close together; an open group gets room below
  return (
    <Sidebar.Group className={cn('gap-0.5', isOpen ? 'pb-5' : undefined)}>
      {group.collapsible ? (
        <Sidebar.GroupTitle className="mb-0 pl-0">
          <button
            type="button"
            className="relative flex items-center w-full pl-5 pr-2.5 py-1.5 leading-5 rounded-md uppercase text-left hover:bg-grayAlpha-100"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
          >
            <span className="absolute left-0.5 inset-y-0 grid place-items-center w-4">
              <FoldArrow isOpen={isOpen} />
            </span>
            {group.title}
          </button>
          {tags}
        </Sidebar.GroupTitle>
      ) : (
        <Sidebar.GroupTitle className="mb-0 pl-5 py-1.5 leading-5">
          {group.title}
          {tags}
        </Sidebar.GroupTitle>
      )}
      {isOpen
        ? group.children.map((link, i) => (
            <LinkItem
              link={link}
              path={`${group.title}/${link.title}`}
              key={`${link.href}-${i}`}
              onClick={onClick}
            />
          ))
        : null}
    </Sidebar.Group>
  )
}
