'use client'

import { ChevronRightIcon, ExternalLinkIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Tag } from './ui/Tag'
import Link from '@/components/Link'
import { SidebarConfig, SidebarGroup, SidebarLink } from '@/types'
import { Sidebar } from '@/components/ui/Sidebar'
import { cn } from '@/utils'

export const DocsSidebar = ({
  config,
  onItemClick,
}: {
  config: SidebarConfig
  onItemClick?: () => void
}) => {
  const listed = useMemo(() => collectHrefs(config.items), [config.items])

  return (
    <ListedPages.Provider value={listed}>
      <Sidebar.Track className="gap-0">
        {config.items.map((item, i) =>
          item.type === 'link' ? (
            <LinkItem link={item} key={`${item.href}-${i}`} onClick={onItemClick} />
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

// The sidebar only shows a page's status: it changes how a reader should use the
// page. The plan stays on the page and in the catalog, so a label always means
// the same thing.
const STATUS_ORDER = [
  ['deprecated', 'legacy'],
  ['alpha', 'beta', 'experimental'],
  ['new', 'soon'],
]

/** The status label an entry shows, the most important one if it has several. */
export function sidebarLabel(tags: string[] | undefined, releaseTag?: string): string | undefined {
  const rank = (tag: string) => STATUS_ORDER.findIndex((names) => names.includes(tag.toLowerCase()))
  const [label] = [...(releaseTag ? [releaseTag] : []), ...(tags ?? [])]
    .filter((tag) => rank(tag) !== -1)
    .sort((a, b) => rank(a) - rank(b))
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : undefined
}

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
  onClick,
}: {
  link: Omit<SidebarLink, 'type'>
  onClick?: () => void
}) => {
  const pathname = usePathname()
  const listed = useContext(ListedPages)
  const isExactMatch = link.isActive ?? pathname === link.href
  const isActiveParent = isAtOrBelow(pathname, link.href, listed)
  const hasActiveChild = hasActiveDescendant(link.children, pathname, listed)
  const isActive = isExactMatch && !hasActiveChild
  const linkRef = useRef<HTMLDivElement>(null)
  const label = sidebarLabel(link.tags, link.releaseTag)
  const target = targetOf(link)

  const [isOpen, setIsOpen] = useState(isActive || isActiveParent || hasActiveChild)

  const toggleOpen = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    if ((isActive || isActiveParent) && link.href !== '') {
      setIsOpen(true)
    }
  }, [isActive, isActiveParent, link.href])

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
          {label ? (
            <Tag className="flex-none ml-2 select-none" variant="gray" size="small">
              {label}
            </Tag>
          ) : null}
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
              {label ? (
                <Tag className="select-none" variant="gray" size="small">
                  {label}
                </Tag>
              ) : null}
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
  const [isOpen, setIsOpen] = useState(!group.collapsible || !!group.defaultOpen || holdsPage)
  // Open the group that holds the page after a client-side navigation
  const [openedFor, setOpenedFor] = useState(pathname)
  if (openedFor !== pathname) {
    setOpenedFor(pathname)
    if (holdsPage) setIsOpen(true)
  }

  const label = sidebarLabel(group.tags)
  const tags = label ? (
    <Tag className="flex-none select-none" variant="gray" size="small">
      {label}
    </Tag>
  ) : null

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
            <LinkItem link={link} key={`${link.href}-${i}`} onClick={onClick} />
          ))
        : null}
    </Sidebar.Group>
  )
}
