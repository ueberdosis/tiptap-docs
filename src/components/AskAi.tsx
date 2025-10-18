'use client'

import { usePathname } from 'next/navigation'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from './ui/Button'
import { FULL_DOMAIN } from '@/utils/constants'

export const AskAi = () => {
  const pathname = usePathname()
  const url = [`${FULL_DOMAIN}`, `${pathname}`].join('')
  const encoded = encodeURIComponent(`
You are a helpful AI assistant and expert in Tiptap and ProseMirror.

The user is currently reading this documentation page:
${url}

Your task:
- Explain clearly what this page is about and what problem it helps solve.
- Describe the key concepts, APIs, or components mentioned on the page.
- Give practical examples or use cases so the user can apply the information right away.
- If the page contains code, summarize what it does and how to use it.
- If you cannot directly read the page, give a general explanation of what this topic likely covers in the context of Tiptap.
- Use plain language and be concise but thorough.
- End with a short summary of how this feature fits into the bigger Tiptap ecosystem.

Output format:
1. **Overview**
2. **How it works**
3. **Example usage**
4. **When to use it**
5. **Related concepts or next steps**
`)

  const urls = [
    { key: 'claude', url: `https://claude.ai/new?q=${encoded}`, label: 'Ask Claude' },
    {
      key: 'openai',
      url: `https://chatgpt.com/?hints=search&q=${encoded}`,
      label: 'Ask OpenAI',
    },
    {
      key: 't3',
      url: `https://t3.chat/new?q=${encoded}`,
      label: 'Ask T3 Chat',
    },
    {
      key: 'perplexity',
      url: `https://www.perplexity.ai/search?q=${encoded}`,
      label: 'Ask Perplexity',
    },
  ]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild className="outline-none ring-0">
        <Button size="small" variant="tertiary">
          Ask AI <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          align="end"
          className="min-w-[160px] bg-white border border-grayAlpha-200 shadow-cardLight rounded-lg p-1.5"
        >
          {urls.map((url) => (
            <DropdownMenu.Item key={url.key} asChild>
              <a
                href={url.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-gray-700 hover:bg-grayAlpha-100 rounded-lg p-2 cursor-pointer outline-none ring-0 flex"
              >
                <span className="flex-auto">{url.label}</span>
              </a>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
