'use client';

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, CopyIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { ControlButton, ControlLink, Segmented } from './controls';
import type { DemoDocument, DemoFile } from './demo-frame';
import type { Framework } from './state';

const JSON_TAB = 'JSON';

/** GitHub mark in the outline style of the other bar icons. */
function GithubIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const LANGUAGES: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  vue: 'vue',
  svelte: 'svelte',
  css: 'css',
  scss: 'scss',
  html: 'html',
  json: 'json',
};

const languageOf = (name: string) => LANGUAGES[name.split('.').pop() ?? ''] ?? 'text';

/**
 * Long code shows its first `collapsedHeight` pixels and a "Show all" bar. The ref goes on the
 * element that clips the code. The bar shows only when the code is taller. Null shows it all.
 */
const useCodeCollapse = (collapsedHeight: number | null) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const isCollapsed = collapsedHeight !== null && !isOpen;

  useEffect(() => {
    const element = ref.current;
    if (!element || !isCollapsed) return;
    const measure = () => {
      setOverflows(element.scrollHeight > element.clientHeight + 1);
      setAtEnd(element.scrollTop + element.clientHeight >= element.scrollHeight - 1);
    };
    element.addEventListener('scroll', measure, { passive: true });
    // The code changes after the first render: highlighting, another file, a new document.
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    const mutation = new MutationObserver(measure);
    mutation.observe(element, { childList: true, characterData: true, subtree: true });
    measure();
    return () => {
      element.removeEventListener('scroll', measure);
      resize.disconnect();
      mutation.disconnect();
    };
  }, [isCollapsed]);

  return [
    ref,
    {
      isOpen,
      isCollapsed,
      isFaded: isCollapsed && !atEnd,
      hasBar: collapsedHeight !== null && (overflows || isOpen),
      toggle: () => setIsOpen((open) => !open),
    },
  ] as const;
};

export type DemoCodeProps = {
  files: DemoFile[] | null;
  document: DemoDocument | null;
  framework: Framework;
  frameworks: Framework[];
  onFrameworkChange: (framework: Framework) => void;
  /** The demo's source on GitHub. Open source demos only. */
  githubUrl?: string;
  /** The demo page has no bridge, so the code cannot be shown. */
  isUnavailable?: boolean;
  demoUrl: string;
  /** The most the code shows before "Show all", in pixels. Null shows it all. */
  collapsedHeight?: number | null;
  className?: string;
};

/** The demo's code: framework switch, its files and the live document as JSON, with copy and GitHub. */
export function DemoCode({
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
}: DemoCodeProps) {
  const [activeName, setActiveName] = useState<string | null>(null);
  const [collapseRef, collapsible] = useCodeCollapse(collapsedHeight);

  const tabs = [...(files ?? []).map((file) => file.name), ...(document ? [JSON_TAB] : [])];
  const name = activeName && tabs.includes(activeName) ? activeName : tabs[0];
  const code =
    name === JSON_TAB
      ? JSON.stringify(document, null, 2)
      : (files?.find((file) => file.name === name)?.content ?? '');
  const language = name === JSON_TAB ? 'json' : languageOf(name ?? '');
  const [copied, onCopy] = useCopyButton(() => navigator.clipboard.writeText(code));

  return (
    <div
      className={cn(
        'not-prose flex min-h-0 flex-col overflow-hidden rounded-xl border bg-fd-card',
        className,
      )}
    >
      <div className="flex items-center gap-2 px-3 pt-3">
        {frameworks.length > 1 ? (
          <Segmented label="Framework">
            {frameworks.map((item) => (
              <ControlButton
                key={item}
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
          <span className="px-1.5 font-medium text-fd-muted-foreground text-xs">{framework}</span>
        )}
        <div className="ms-auto flex items-center gap-1">
          {githubUrl ? (
            <ControlLink
              label="Source on GitHub"
              tipAlign="end"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon />
            </ControlLink>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-1 border-b px-3 py-2">
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
                'shrink-0 rounded-md px-2 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
                tab === JSON_TAB && 'ms-auto',
                tab === name
                  ? 'bg-fd-accent text-fd-accent-foreground'
                  : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
              )}
              title={tab === JSON_TAB ? 'The document as JSON, live as you edit' : undefined}
            >
              {tab}
            </button>
          ))}
        </div>
        {code ? (
          <ControlButton
            label={copied ? 'Copied' : 'Copy code'}
            tipAlign="end"
            onClick={onCopy}
            aria-live="polite"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? <span>Copied</span> : null}
          </ControlButton>
        ) : null}
      </div>

      <div
        role="tabpanel"
        aria-label={name}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the code scrolls by keyboard
        tabIndex={0}
        ref={collapseRef}
        className="relative min-h-0 flex-1 overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-inset"
        style={collapsible.isCollapsed ? { maxHeight: collapsedHeight ?? undefined } : undefined}
      >
        {isUnavailable ? (
          <p className="p-4 text-fd-muted-foreground text-sm">
            The code of this demo isn’t available here.{' '}
            <a className="underline" href={demoUrl} target="_blank" rel="noopener noreferrer">
              Open the demo
            </a>
            .
          </p>
        ) : !files ? (
          <p className="p-4 text-fd-muted-foreground text-sm">Loading the code…</p>
        ) : (
          <DynamicCodeBlock
            lang={language}
            code={code}
            codeblock={{
              allowCopy: false,
              className: 'my-0 overflow-visible rounded-none border-0 bg-transparent',
              viewportProps: { className: 'max-h-none overflow-visible' },
            }}
          />
        )}
      </div>
      {collapsible.hasBar ? (
        <button
          type="button"
          aria-expanded={collapsible.isOpen}
          onClick={collapsible.toggle}
          className={cn(
            'relative flex w-full shrink-0 items-center justify-center gap-1.5 border-t py-2 font-medium text-fd-muted-foreground text-xs transition-colors hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-inset',
            collapsible.isFaded &&
              'before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-12 before:bg-linear-to-t before:from-fd-card before:to-transparent',
          )}
        >
          {collapsible.isOpen ? (
            <ChevronUpIcon className="size-3.5" />
          ) : (
            <ChevronDownIcon className="size-3.5" />
          )}
          {collapsible.isOpen ? 'Show less' : 'Show all'}
        </button>
      ) : null}
    </div>
  );
}
