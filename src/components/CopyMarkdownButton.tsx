'use client'

import { useClipboard } from '@mantine/hooks'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import TurndownService from 'turndown'
import { Button } from './ui/Button'

export type CopyMarkdownButtonClientProps = {
  title?: string
  className?: string
}

export const CopyMarkdownButton = ({ title, className }: CopyMarkdownButtonClientProps) => {
  const clipboard = useClipboard()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    if (isCopied) return
    const html = document.querySelector('.mdx-content')?.innerHTML
    if (html === undefined) return

    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500)

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
    })
    let markdown = turndownService.turndown(html)

    markdown = `# ${title}\n\n${markdown}`

    clipboard.copy(markdown)
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
      className={className}
    >
      <IconComponent className="size-3" />
      Copy markdown
    </Button>
  )
}
