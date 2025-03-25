'use client'

import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
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
  return (
    <Sidebar.Track>
      {config.items.map((item, i) =>
        item.type === 'link' ? (
          <LinkItem link={item} key={`${item.href}-${i}`} onClick={onItemClick} />
        ) : (
          <GroupItem group={item} key={`${item.href}-${i}`} onClick={onItemClick} />
        ),
      )}
    </Sidebar.Track>
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
  const isActive = pathname === link.href
  const isActiveParent = pathname.startsWith(link.href)

  const [isOpen, setIsOpen] = useState(isActive || isActiveParent)

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

  const toggleButtonClassName = cn(
    'p-0.5 rounded',
    !isOpen ? 'hover:bg-grayAlpha-100' : 'bg-grayAlpha-100',
  )

  return (
    <div>
      <Sidebar.Button
        asChild
        isActive={isActive}
        onClick={link.href === '' ? toggleOpen : undefined}
      >
        <Link href={link.href} onClick={onClick}>
          {link.title}
          <span className="flex gap-1">
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
              <button className={toggleButtonClassName} onClick={toggleOpen}>
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
      {link.children ? (
        <div
          className={cn(
            'pl-2 my-2 space-y-1 ml-2 border-l border-grayAlpha-300',
            isOpen ? 'block' : 'hidden',
          )}
        >
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
  return (
    <Sidebar.Group>
      <Sidebar.GroupTitle>
        {group.title}
        {group.tags ? (
          <span className="flex items-center gap-0.5">
            {group.tags.map((tag) => (
              <Tag key={tag} className="uppercase select-none" size="small">
                {tag}
              </Tag>
            ))}
          </span>
        ) : null}
      </Sidebar.GroupTitle>
      {group.children.map((link, i) => (
        <LinkItem link={link} key={`${link.href}-${i}`} onClick={onClick} />
      ))}
    </Sidebar.Group>
  )
}
