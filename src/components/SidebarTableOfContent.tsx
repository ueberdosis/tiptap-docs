'use client'

import { useToC } from '@/hooks/useToC'
import { TableOfContent } from './TableOfContent'

export const SidebarTableOfContent = () => {
  const { activeId, headlines } = useToC()

  if (!headlines.length) return null

  return <TableOfContent headlines={headlines} activeId={activeId} />
}
