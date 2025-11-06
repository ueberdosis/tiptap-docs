'use client'

import IframeResizer from 'iframe-resizer-react'
import { DEMO_URL, PRO_DEMO_URL } from '@/utils/constants'

export type CodeDemoProps = {
  src?: string
  path?: string
  isPro?: boolean
  isSmall?: boolean
  isLarge?: boolean
  isScrollable?: boolean
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
  caption,
  captionActions,
}: CodeDemoProps) => {
  const iframeHeightClass = isSmall ? 'h-60' : isLarge ? 'h-[70vh] md:h-124' : 'h-96'
  const hasCaption = caption || captionActions

  const iframeProps = {
    src: src ? src : (isPro ? PRO_DEMO_URL : DEMO_URL) + (path || ''),
    className: `w-full ${iframeHeightClass}`,
    ...(isScrollable !== undefined && { scrolling: isScrollable }),
  }

  return (
    <>
      {hasCaption && (
        <div
          className="flex items-center gap-4 p-3 rounded-[0.625rem] mb-2 border border-grayAlpha-200 shadow-cardHover"
          style={{
            background:
              'linear-gradient(45deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.3) 100%)',
          }}
        >
          {caption && (
            <p
              className="flex-1 max-w-sm m-0 text-grayAlpha-700"
              style={{ fontSize: '12px', lineHeight: '1.3' }}
            >
              {caption}
            </p>
          )}
          {captionActions && (
            <div className="flex items-center gap-2 shrink-0 ml-auto text-xs">{captionActions}</div>
          )}
        </div>
      )}
      <div
        className={`shadow-cardHover rounded-[0.625rem] ${hasCaption ? 'mb-12' : 'my-12'} bg-white overflow-hidden`}
      >
        <IframeResizer {...iframeProps} />
      </div>
    </>
  )
}
