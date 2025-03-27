'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { VERSIONS } from '@/utils/constants'
import { getCurrentVersion } from '@/utils/getCurrentVersion'
import { getRecentVersion } from '@/utils/versioning.client'

export const useCurrentVersion = () => {
  const pathname = usePathname()

  const currentVersion = useMemo(() => {
    const versionFromPathname = getCurrentVersion(pathname)
    return (
      VERSIONS.find((version) => version.version === versionFromPathname) ||
      getRecentVersion(VERSIONS)
    )
  }, [pathname])

  return currentVersion
}
