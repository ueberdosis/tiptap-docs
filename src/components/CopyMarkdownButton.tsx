'use client'

import { useClipboard } from '@mantine/hooks'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import TurndownService from 'turndown'
import { renderToString } from 'react-dom/server'
import { cn } from '@/utils'

export type CopyMarkdownButtonClientProps = {
  title?: string
  content: JSX.Element
  className?: string
}

export const CopyMarkdownButton = ({
  title,
  content,
  className,
}: CopyMarkdownButtonClientProps) => {
  const clipboard = useClipboard()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    if (isCopied) return
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500)
    // Convert HTML to markdown using turndown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
    })

    const html = renderToString(content)

    let markdown = turndownService.turndown(html)

    markdown = `# ${title}\n\n${markdown}`

    clipboard.copy(markdown)
  }

  const IconComponent = isCopied ? CheckIcon : CopyIcon

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={isCopied}
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
