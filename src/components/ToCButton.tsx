'use client'

import { Button } from './ui/Button'
import TableOfContentIcon from '@/assets/icons/TableOfContent.svg'
import { useToC } from '@/hooks/useToC'
import { useAppState } from '@/providers/AppState'

export const ToCButton = () => {
  const { headlines } = useToC()
  const { setMobileTocOpen } = useAppState()

  if (!headlines.length) return null

  return (
    <Button variant="tertiary" size="small" onClick={() => setMobileTocOpen(true)}>
      <TableOfContentIcon className="size-4 text-grayAlpha-400" />
    </Button>
  )
}
