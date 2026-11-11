'use client'

import { useClipboard } from '@mantine/hooks'
import { CheckIcon, CopyIcon, Github } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CodeCollapseBar, useCodeCollapse } from '../CodeCollapse'
import { ControlButton, ControlLink, Segmented } from './controls'
import type { DemoDocument, DemoFile } from './DemoFrame'
import type { Framework } from './state'
import { cn } from '@/utils'

const JSON_TAB = 'JSON'

const LANGUAGES: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  vue: 'vue',
  css: 'css',
  scss: 'scss',
  html: 'html',
  json: 'json',
}

const languageOf = (name: string) => LANGUAGES[name.split('.').pop() ?? ''] ?? 'text'

/** Shiki, as in the page's own code blocks, loaded when a demo first shows its code. */
const useHighlighted = (code: string, language: string) => {
  const [result, setResult] = useState<{ code: string; html: string } | null>(null)

  useEffect(() => {
    let isCurrent = true

    import('shiki/bundle/web')
      .then(({ codeToHtml }) =>
        codeToHtml(code, {
          lang: language === 'text' ? 'text' : language,
          theme: 'github-dark-high-contrast',
        }),
      )
      .then((html) => {
        if (isCurrent) setResult({ code, html })
      })
      .catch(() => {
        // The plain code below stays
      })

    return () => {
      isCurrent = false
    }
  }, [code, language])

  return result?.code === code ? result.html : null
}

export type DemoCodeProps = {
  files: DemoFile[] | null
  document: DemoDocument | null
  framework: Framework
  frameworks: Framework[]
  onFrameworkChange: (framework: Framework) => void
  /** The demo's source on GitHub; open-source demos only. */
  githubUrl?: string
  /** No demos app bridge: the code can't be shown here. */
  isUnavailable?: boolean
  demoUrl: string
  /**
   * The most the code shows before "Show all", in pixels; null shows it all. A block that keeps
   * its own height (the Code view, Expand) passes null.
   */
  collapsedHeight?: number | null
  className?: string
}

/** The demo's code: React / Vue, its files and the live document as JSON, with copy and GitHub. */
export const DemoCode = ({
  files,
  document,
  framework,
  frameworks,
  onFrameworkChange,
  githubUrl,
  isUnavailable,
  demoUrl,
  collapsedHeight = null,
  className,
}: DemoCodeProps) => {
  const [activeName, setActiveName] = useState<string | null>(null)
  const [collapseRef, collapsible] = useCodeCollapse<HTMLDivElement>(collapsedHeight)
  const clipboard = useClipboard({ timeout: 1200 })

  const tabs = [...(files ?? []).map((file) => file.name), ...(document ? [JSON_TAB] : [])]
  const name = activeName && tabs.includes(activeName) ? activeName : tabs[0]
  const code =
    name === JSON_TAB
      ? JSON.stringify(document, null, 2)
      : (files?.find((file) => file.name === name)?.content ?? '')
  const language = name === JSON_TAB ? 'json' : languageOf(name ?? '')
  const html = useHighlighted(code, language)

  const onCopy = () => {
    clipboard.copy(code)
    toast('Copied to clipboard', { duration: 1200 })
  }

  return (
    <div
      className={cn('flex min-h-0 flex-col bg-black text-white', className)}
      style={collapsible.isCollapsed ? { maxHeight: collapsedHeight ?? undefined } : undefined}
    >
      <div className="flex items-center gap-2 px-3 pt-3">
        {frameworks.length > 1 ? (
          <Segmented label="Framework" tone="dark">
            {frameworks.map((item) => (
              <ControlButton
                key={item}
                tone="dark"
                label={item}
                tooltip={`Show the ${item} demo`}
                aria-pressed={item === framework}
                isActive={item === framework}
                onClick={() => onFrameworkChange(item)}
                className="px-2.5"
              >
                {item}
              </ControlButton>
            ))}
          </Segmented>
        ) : (
          <span className="px-1.5 text-xs font-semibold text-whiteAlpha-700">{framework}</span>
        )}
        <div className="ml-auto flex items-center gap-1">
          {githubUrl ? (
            <ControlLink
              tone="dark"
              label="Source on GitHub"
              tipAlign="end"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github />
            </ControlLink>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-whiteAlpha-100 px-3 pb-2 pt-2">
        <div
          role="tablist"
          aria-label="Files"
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={tab === name}
              onClick={() => setActiveName(tab)}
              className={cn(
                'shrink-0 rounded-md px-2 py-1 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-purple-600',
                tab === JSON_TAB ? 'ml-auto' : undefined,
                tab === name
                  ? 'bg-whiteAlpha-200 text-white'
                  : 'text-whiteAlpha-600 hover:bg-whiteAlpha-100 hover:text-white',
              )}
              title={tab === JSON_TAB ? 'The document as JSON, live as you edit' : undefined}
            >
              {tab}
            </button>
          ))}
        </div>
        {code ? (
          <ControlButton
            tone="dark"
            label={clipboard.copied ? 'Copied' : 'Copy code'}
            tipAlign="end"
            onClick={onCopy}
          >
            {clipboard.copied ? <CheckIcon /> : <CopyIcon />}
          </ControlButton>
        ) : null}
      </div>

      <div
        role="tabpanel"
        aria-label={name}
        tabIndex={0}
        ref={collapseRef}
        className={cn(
          'relative min-h-0 flex-1 p-4 text-[0.8125rem] leading-relaxed focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600 [&_pre]:!bg-transparent [&_pre]:m-0',
          'overflow-auto',
        )}
      >
        {isUnavailable ? (
          <p className="m-0 text-whiteAlpha-700">
            The code of this demo isn’t available here.{' '}
            <a className="underline" href={demoUrl} target="_blank" rel="noopener noreferrer">
              Open the demo
            </a>
            .
          </p>
        ) : !files ? (
          <p className="m-0 text-whiteAlpha-600">Loading the code…</p>
        ) : html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="font-mono">{code}</pre>
        )}
      </div>
      {collapsible.hasBar ? (
        <CodeCollapseBar
          isOpen={collapsible.isOpen}
          isFaded={collapsible.isFaded}
          onToggle={collapsible.toggle}
        />
      ) : null}
    </div>
  )
}
