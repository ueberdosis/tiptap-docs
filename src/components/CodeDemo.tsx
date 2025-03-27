'use client'

import IframeResizer from 'iframe-resizer-react'
import { useCurrentVersion } from '@/hooks/useCurrentVersion'
import { isInternalVersion } from '@/utils/versioning.client'

export type CodeDemoProps = {
  src?: string
  path: string
  isPro?: boolean
}

export const CodeDemo = ({ src, path, isPro }: CodeDemoProps) => {
  const currentVersion = useCurrentVersion()

  if (!currentVersion?.version || !isInternalVersion(currentVersion)) {
    return null
  }

  return (
    <div className="shadow-cardHover rounded-[0.625rem] my-12 bg-white">
      <IframeResizer
        src={
          src
            ? src
            : `${isPro ? currentVersion.demoUrls.pro : currentVersion.demoUrls.free}/preview${path}`
        }
        className="w-full h-96"
      />
    </div>
  )
}
