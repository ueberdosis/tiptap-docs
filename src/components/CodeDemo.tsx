'use client'

import IframeResizer from 'iframe-resizer-react'
import { DEMO_URL, PRO_DEMO_URL } from '@/utils/constants'

export type CodeDemoProps = {
  path: string
  isPro?: boolean
}

export const CodeDemo = ({ path, isPro }: CodeDemoProps) => {
  return (
    <div className="shadow-cardHover rounded-[0.625rem] my-12">
      <IframeResizer src={(isPro ? PRO_DEMO_URL : DEMO_URL) + path} className="w-full h-96" />
    </div>
  )
}
