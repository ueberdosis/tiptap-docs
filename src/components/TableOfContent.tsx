import { ReactNode } from 'react'
import { cn } from '@/utils'

function TocItem({
  id,
  children,
  isActive,
  onClick,
}: {
  id: string
  children: ReactNode
  isActive?: boolean
  onClick?: () => void
}) {
  const itemClass = cn(
    'block text-sm leading-[130%] px-2.5 py-2 rounded-lg bg-transparent transition-colors',
    !isActive ? 'hover:bg-grayAlpha-50' : '',
    isActive ? 'text-purple-500' : '',
  )

  return (
    <a onClick={onClick} className={itemClass} href={`#${id}`}>
      {children}
    </a>
  )
}

export const TableOfContent = ({
  onClick,
  headlines,
  activeId,
}: {
  onClick?: () => void
  headlines: HTMLHeadingElement[]
  activeId: string | null
}) => {
  if (!headlines.length) return null

  return (
    <div>
      <div className="font-bold text-xs uppercase leading-[110%] mb-2.5 px-2.5">On this page</div>
      <TocItem id="page-title" isActive={activeId === null} onClick={onClick}>
        Introduction
      </TocItem>
      {headlines.map((headline) => (
        <TocItem
          key={headline.id}
          id={headline.id}
          isActive={headline.id === activeId}
          onClick={onClick}
        >
          {headline.textContent ? headline.textContent.replace(' #', '') : ''}
        </TocItem>
      ))}
    </div>
  )
}
