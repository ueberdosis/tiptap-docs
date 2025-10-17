'use client'

import { useClipboard } from '@mantine/hooks'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import TurndownService from 'turndown'
import { renderToString } from 'react-dom/server'
import { Button } from './ui/Button'

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
    const html = renderToString(content)

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
