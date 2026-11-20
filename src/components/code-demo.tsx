'use client';

import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import type { IFrameResizerElement } from 'iframe-resizer';
import { ExternalLink } from 'lucide-react';
import { type ReactNode, useEffect, useRef } from 'react';
import { DemoViewer, type DemoViewerProps } from '@/components/demo-viewer/demo-viewer';
import { cn } from '@/lib/cn';
import { useDemoBaseUrl } from '@/lib/demo-urls';

/** Shows every demo in the demo viewer, except `external` demos and demos with `captionActions`. */
const demoViewer = process.env.NEXT_PUBLIC_DEMO_VIEWER === 'true';

export type CodeDemoProps = {
  /** Full demo URL. Used instead of `path`. */
  src?: string;
  /** Demo path, added to the demo base URL. */
  path?: string;
  /** Uses the Pro demo base URL. */
  isPro?: boolean;
  isSmall?: boolean;
  isLarge?: boolean;
  /** Shows scrollbars in the iframe when its content is larger. */
  isScrollable?: boolean;
  /** Shows a box with a link to the demo instead of the iframe. */
  external?: boolean;
  externalTitle?: string;
  externalDescription?: string;
  externalIcon?: ReactNode;
  /** Text in a box above the demo. */
  caption?: ReactNode;
  /** Actions at the right of the caption box. */
  captionActions?: ReactNode;
  /** Shows the demo in the demo viewer. */
  viewer?: boolean;
} & Pick<
  DemoViewerProps,
  | 'view'
  | 'code'
  | 'codeHeight'
  | 'frameworks'
  | 'height'
  | 'maxHeight'
  | 'resizable'
  | 'themes'
  | 'sizes'
>;

/** Iframe that resizes to the height of the demo page. The demo page must load the child script. */
function DemoFrame({
  src,
  className,
  isScrollable,
}: {
  src: string;
  className: string;
  isScrollable?: boolean;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = ref.current as IFrameResizerElement | null;
    if (!iframe) return;
    let active = true;
    import('iframe-resizer').then(({ iframeResize }) => {
      if (!active) return;
      iframeResize(
        { ...(isScrollable !== undefined && { scrolling: isScrollable }), onClose: () => false },
        iframe,
      );
    });
    return () => {
      active = false;
      iframe.iFrameResizer?.removeListeners();
    };
  }, [isScrollable]);

  return <iframe ref={ref} title="iframe" src={src} className={cn('w-full', className)} />;
}

/** Live demo from the hosted demo pages, in an iframe that grows with its content. */
export function CodeDemo({
  src,
  path = '',
  isPro,
  isSmall,
  isLarge,
  isScrollable,
  external,
  externalTitle,
  externalDescription,
  externalIcon,
  caption,
  captionActions,
  viewer = demoViewer,
  ...viewerProps
}: CodeDemoProps) {
  const baseUrl = useDemoBaseUrl(isPro);
  const url = src || baseUrl + path;
  const heightClass = isSmall ? 'h-60' : isLarge ? 'h-[70vh] md:h-160' : 'h-96';
  const hasCaption = Boolean(caption || captionActions);

  if (viewer && !external && !captionActions) {
    return (
      <DemoViewer
        path={path}
        isPro={isPro}
        src={src}
        isSmall={isSmall}
        isLarge={isLarge}
        caption={caption}
        {...viewerProps}
      />
    );
  }

  return (
    <>
      {hasCaption && (
        <div className="not-prose mb-2 flex items-center gap-4 rounded-xl border bg-fd-card p-3 text-xs text-fd-muted-foreground">
          {caption && <p className="max-w-sm flex-1 leading-[1.3]">{caption}</p>}
          {captionActions && (
            <div className="ms-auto flex shrink-0 items-center gap-2">{captionActions}</div>
          )}
        </div>
      )}
      <div
        className={cn(
          // Next to a code block or another demo, the gap is 1rem.
          'code-demo not-prose overflow-hidden rounded-xl border',
          '[&:has(+_:is(figure.shiki,.code-demo))]:mb-4 [:is(figure.shiki,.code-demo)+&]:mt-4',
          hasCaption ? 'mb-12' : 'my-12',
          !external && 'bg-white',
        )}
      >
        {external ? (
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-6 bg-fd-card p-8 text-center',
              heightClass,
            )}
          >
            {externalIcon && (
              <div className="flex size-12 items-center justify-center rounded-full border bg-fd-background">
                {externalIcon}
              </div>
            )}
            <div className="max-w-xs space-y-1.5">
              <p className="font-semibold leading-tight text-fd-foreground">
                {externalTitle || 'View Live Demo'}
              </p>
              <p className="text-sm leading-relaxed text-fd-muted-foreground">
                {externalDescription || 'This demo needs to be opened in a new window.'}
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'primary' }), 'gap-2')}
            >
              <ExternalLink className="size-4" />
              Open Demo
            </a>
          </div>
        ) : (
          <DemoFrame src={url} className={heightClass} isScrollable={isScrollable} />
        )}
      </div>
    </>
  );
}
