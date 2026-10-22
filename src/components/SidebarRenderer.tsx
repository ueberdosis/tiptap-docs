'use client'

import { ChevronDownIcon, ChevronRightIcon, ExternalLinkIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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
      <Sidebar.Track>
        {config.items.map((item, i) =>
          item.type === 'link' ? (
            <LinkItem link={item} key={`${item.href}-${i}`} onClick={onItemClick} />
          ) : (
            <GroupItem group={item} key={`${item.href}-${i}`} onClick={onItemClick} />
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

  const toggleButtonClassName = cn(
    'p-0.5 rounded',
    !isOpen ? 'hover:bg-grayAlpha-100' : 'bg-grayAlpha-100',
  )

  return (
    <div ref={linkRef}>
      {link.disabled ? (
        <Sidebar.Button isActive={false} className="opacity-40 cursor-default pointer-events-none">
          <span className="flex-grow flex items-baseline">
            <span>{link.title}</span>
          </span>
        </Sidebar.Button>
      ) : (
        <Sidebar.Button
          asChild
          isActive={isActive}
          onClick={link.href === '' ? toggleOpen : undefined}
        >
          <Link
            href={link.href}
            onClick={onClick}
            className="flex items-center justify-between w-full"
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            <span className="flex-grow flex items-baseline">
              <span>{link.title}</span>
              {link.releaseTag && (
                <sup className="inline-block ml-1 text-[10px] text-grayAlpha-600">
                  {link.releaseTag.toUpperCase()}
                </sup>
              )}
            </span>
            <span className="flex gap-1 items-center">
              {link.external && <ExternalLinkIcon className="size-3.5 text-grayAlpha-400" />}
              {link.tags ? (
                <span className="flex items-center gap-0.5">
                  {link.tags.map((tag) => (
                    <Tag key={tag} className="select-none" variant="gray" size="small">
                      {tag}
                    </Tag>
                  ))}
                </span>
              ) : null}
              {link.children ? (
                <button
                  type="button"
                  className={toggleButtonClassName}
                  onClick={toggleOpen}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${link.title}`}
                >
                  {isOpen ? (
                    <ChevronDownIcon className="size-4 text-grayAlpha-500" />
                  ) : (
                    <ChevronRightIcon className="size-4 text-grayAlpha-500" />
                  )}
                </button>
              ) : null}
            </span>
          </Link>
        </Sidebar.Button>
      )}
      {/* Closed entries render no children: the global sidebar holds several hundred links */}
      {link.children && isOpen ? (
        <div className="pl-2 my-2 space-y-1 ml-2 border-l border-grayAlpha-300">
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

  const tags = group.tags ? (
    <span className="flex items-center gap-0.5">
      {group.tags.map((tag) => (
        <Tag key={tag} className="uppercase select-none" size="small">
          {tag}
        </Tag>
      ))}
    </span>
  ) : null

  return (
    <Sidebar.Group>
      {group.collapsible ? (
        <Sidebar.GroupTitle className="pl-0">
          <button
            type="button"
            className="flex items-center gap-1 pl-1 pr-2 py-0.5 -my-0.5 rounded uppercase hover:bg-grayAlpha-100"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <ChevronDownIcon className="size-3.5 text-grayAlpha-500" aria-hidden="true" />
            ) : (
              <ChevronRightIcon className="size-3.5 text-grayAlpha-500" aria-hidden="true" />
            )}
            {group.title}
          </button>
          {tags}
        </Sidebar.GroupTitle>
      ) : (
        <Sidebar.GroupTitle>
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
