'use client'

import IframeResizer from 'iframe-resizer-react'
import { DEMO_URL, PRO_DEMO_URL } from '@/utils/constants'

export type CodeDemoProps = {
  src?: string
  path: string
  isPro?: boolean
  isSmall?: boolean
  isLarge?: boolean
}

export const CodeDemo = ({ src, path, isPro, isSmall, isLarge }: CodeDemoProps) => {
  const iframeHeightClass = isSmall
    ? 'h-60'
    : isLarge
      ? 'h-[70vh] md:h-124' //
      : 'h-96'

  return (
    <div className="shadow-cardHover rounded-[0.625rem] my-12 bg-white">
      <IframeResizer
        src={src ? src : (isPro ? PRO_DEMO_URL : DEMO_URL) + path}
        className={`w-full ${iframeHeightClass}`}
      />
    </div>
  )
}
