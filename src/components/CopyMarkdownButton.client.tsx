'use client'

import { useClipboard } from '@mantine/hooks'
import { CopyIcon } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { cn } from '@/utils'

export type CopyMarkdownButtonClientProps = {
  content: string
  className?: string
}

export const CopyMarkdownButtonClient = ({ content, className }: CopyMarkdownButtonClientProps) => {
  const clipboard = useClipboard({ timeout: 500 })

  const handleCopy = useCallback(() => {
    clipboard.copy(content)
    toast('Copied markdown to clipboard', { duration: 1200 })
  }, [content, clipboard])

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700',
        'bg-gray-50 border border-gray-200 rounded-lg',
        'hover:bg-gray-100 hover:border-gray-300',
        'transition-colors duration-200',
        className,
      )}
    >
      <CopyIcon className="size-4" />
      Copy markdown
    </button>
  )
}
