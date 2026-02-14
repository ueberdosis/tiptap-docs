'use client'

import { ExternalLink } from 'lucide-react'
import IframeResizer from 'iframe-resizer-react'
import { Button } from './ui/Button'
import { DEMO_URL, PRO_DEMO_URL } from '@/utils/constants'

export type CodeDemoProps = {
  src?: string
  path: string
  isPro?: boolean
  isSmall?: boolean
  isLarge?: boolean
  isScrollable?: boolean
  external?: boolean
  externalTitle?: string
  externalDescription?: string
  externalIcon?: React.ReactNode
  caption?: React.ReactNode
  captionActions?: React.ReactNode
}

export const CodeDemo = ({
  src,
  path,
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
}: CodeDemoProps) => {
  const iframeHeightClass = isSmall ? 'h-60' : isLarge ? 'h-[70vh] md:h-124' : 'h-96'
  const hasCaption = caption || captionActions
  const url = src ? src : (isPro ? PRO_DEMO_URL : DEMO_URL) + path

  const iframeProps = {
    src: url,
    className: `w-full ${iframeHeightClass} bg-white dark:bg-gray-950`,
    ...(isScrollable !== undefined && { scrolling: isScrollable }),
  }

  return (
    <>
      {hasCaption && (
        <div className="flex items-center gap-4 p-3 rounded-[0.625rem] mb-2 border border-grayAlpha-200 dark:border-white/10 shadow-cardHover bg-white dark:bg-black/5">
          {caption && (
            <p
              className="flex-1 max-w-sm m-0 text-grayAlpha-700 dark:text-gray-400"
              style={{ fontSize: '12px', lineHeight: '1.3' }}
            >
              {caption}
            </p>
          )}
          {captionActions && (
            <div className="flex items-center gap-2 shrink-0 ml-auto text-xs dark:text-gray-300">
              {captionActions}
            </div>
          )}
        </div>
      )}
      <div
        className={`shadow-cardHover rounded-[0.625rem] ${hasCaption ? 'mb-12' : 'my-12'} bg-white dark:bg-gray-950 overflow-hidden border dark:border-white/10`}
      >
        {external ? (
          <div
            className={`${iframeHeightClass} flex flex-col items-center justify-center gap-6 bg-grayAlpha-50 dark:bg-gray-900 text-center p-8`}
          >
            {externalIcon && (
              <div className="flex items-center justify-center size-12 rounded-full bg-white dark:bg-gray-800 shadow-sm ring-1 ring-grayAlpha-200 dark:ring-white/10">
                {externalIcon}
              </div>
            )}
            <div className="max-w-xs space-y-1.5">
              <div className="text-base font-semibold text-grayAlpha-900 dark:text-white leading-tight">
                {externalTitle || 'View Live Demo'}
              </div>
              <div className="text-sm text-grayAlpha-500 dark:text-gray-400 leading-relaxed">
                {externalDescription || 'This demo needs to be opened in a new window.'}
              </div>
            </div>
            <Button asChild variant="primary" className="shadow-sm">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                <span>Open Demo</span>
              </a>
            </Button>
          </div>
        ) : (
          <IframeResizer {...iframeProps} />
        )}
      </div>
    </>
  )
}
