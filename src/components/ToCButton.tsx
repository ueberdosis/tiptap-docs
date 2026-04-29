'use client'

import { TableOfContentIcon } from './icons/TableOfContentIcon'
import { Button } from './ui/Button'
import { useToC } from '@/hooks/useToC'
import { useAppState } from '@/providers/AppState'

export const ToCButton = () => {
  const { headlines } = useToC()
  const { setMobileTocOpen } = useAppState()

  if (!headlines.length) return null

  return (
    <Button variant="tertiary" size="small" onClick={() => setMobileTocOpen(true)}>
      <TableOfContentIcon className="size-4 text-foreground-subtle" />
    </Button>
  )
}
