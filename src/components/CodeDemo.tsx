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
        <div className="flex items-center justify-between gap-6 px-4 py-4 bg-gradient-to-r from-white to-gray-50 rounded-t-[0.625rem] shadow-cardHover text-xs text-grayAlpha-700">
          {caption && <span className="max-w-sm">{caption}</span>}
          {captionActions && (
            <div className="flex items-center gap-2 shrink-0 ml-auto">{captionActions}</div>
          )}
        </div>
      )}
      <div
        className={`shadow-cardHover ${hasCaption ? 'rounded-b-[0.625rem] mb-12' : 'rounded-[0.625rem] my-12'} bg-white overflow-hidden`}
      >
        <IframeResizer {...iframeProps} />
      </div>
    </>
  )
}
