'use client'

import { Button } from './ui/Button'
import TableOfContentIcon from '@/assets/icons/TableOfContent.svg?url'
import { useToC } from '@/hooks/useToC'
import { useAppState } from '@/providers/AppState'

export const ToCButton = () => {
  const { headlines } = useToC()
  const { setMobileTocOpen } = useAppState()

  if (!headlines.length) return null

  return (
    <Button variant="tertiary" size="small" onClick={() => setMobileTocOpen(true)}>
      <img src={TableOfContentIcon.src} alt="" aria-hidden="true" className="size-4" />
    </Button>
  )
}
