'use client';
import { useSpaciousLayout } from 'fumadocs-ui/layouts/spacious';
import { type ReactNode, useLayoutEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { placeToc, placeTocScript, tocAlign, tocOffsetStyleId } from '@/lib/place-toc';

/**
 * A block in the page body that also takes the table of contents' column. The table of contents
 * starts below it.
 *
 * It widens by Fumadocs' `--fd-toc-width` only at the `5xl` container width and while the AI chat
 * is closed, the rules by which Fumadocs shows the table of contents. Without that variable it is
 * as wide as the text.
 *
 * On the first load, an inline script right after the span places the table of contents before
 * the first paint. After a client navigation, and whenever the span or the page changes size, a
 * layout effect does.
 */
export function TocSpan({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    props: { aiChat },
  } = useSpaciousLayout();

  useLayoutEffect(() => {
    const span = ref.current;
    const page = document.getElementById('nd-page');
    if (!span || !page) return;
    const update = () => placeToc(span, tocAlign, tocOffsetStyleId);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(span);
    observer.observe(page);
    return () => {
      observer.disconnect();
      document.getElementById(tocOffsetStyleId)?.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          !(aiChat?.open && aiChat.panel) &&
            '@5xl:w-[calc(100%+var(--fd-toc-width))] @5xl:max-w-none',
          className,
        )}
      >
        {children}
      </div>
      <script
        // Runs from the server HTML only. A script that React adds in the browser never runs, so it
        // gets a data type there, which React does not warn about.
        type={typeof window === 'undefined' ? undefined : 'text/plain'}
        suppressHydrationWarning
        // biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed script from our own code
        dangerouslySetInnerHTML={{ __html: placeTocScript }}
      />
    </>
  );
}
