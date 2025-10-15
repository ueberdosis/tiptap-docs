'use client'

import { useClipboard } from '@mantine/hooks'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils'

export type CopyMarkdownButtonClientProps = {
  content: string
  className?: string
}

export const CopyMarkdownButtonClient = ({ content, className }: CopyMarkdownButtonClientProps) => {
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
    <button
      onClick={handleCopy}
      aria-disabled={isCopied}
      aria-label={isCopied ? 'Copied markdown' : 'Copy markdown'}
      className={cn(
        'flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-700',
        'hover:bg-grayAlpha-100 rounded-lg',
        'transition-colors duration-200',
        className,
      )}
    >
      <IconComponent className="size-4" />
      Copy markdown
    </button>
  )
}
