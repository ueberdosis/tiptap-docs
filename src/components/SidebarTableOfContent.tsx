'use client'

import { TableOfContent } from './TableOfContent'
import { useToC } from '@/hooks/useToC'

export const SidebarTableOfContent = () => {
  const { activeId, headlines } = useToC()

  if (!headlines.length) return null

  return <TableOfContent headlines={headlines} activeId={activeId} />
}
