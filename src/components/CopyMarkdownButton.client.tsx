'use client'

import { useClipboard } from '@mantine/hooks'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/Button'

export type CopyMarkdownButtonClientProps = {
  content: string
}

export const CopyMarkdownButtonClient = ({ content }: CopyMarkdownButtonClientProps) => {
  const clipboard = useClipboard()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    if (isCopied) return
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500)
    clipboard.copy(content)
  }

  const IconComponent = isCopied ? CheckIcon : CopyIcon

  return (
    <Button
      type="button"
      size="small"
      variant="tertiary"
      onClick={handleCopy}
      disabled={isCopied}
      aria-label={isCopied ? 'Copied markdown' : 'Copy markdown'}
    >
      <IconComponent className="size-3" />
      Copy markdown
    </Button>
  )
}
