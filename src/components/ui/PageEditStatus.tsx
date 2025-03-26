'use client'

import { usePathname } from 'next/navigation'
import { Button } from './Button'
import Link from '@/components/Link'
import { PageMeta } from '@/types'
import { getRepoBase } from '@/utils'
import { getCurrentVersion } from '@/utils/getCurrentVersion'
import { getRecentVersion } from '@/utils/versioning.client'
import { VERSIONS } from '@/utils/constants'

export const PageEditStatus = ({
  allMeta,
}: {
  allMeta: Record<string, PageMeta & { path: string }>
}) => {
  const pathname = usePathname()
  const version = getCurrentVersion(pathname)
  const defaultVersion = getRecentVersion(VERSIONS)
  let finalPathname = pathname

  if (!version && defaultVersion) {
    finalPathname = `/${defaultVersion.version}${pathname}`
  }

  const meta =
    pathname !== '/'
      ? allMeta[`${finalPathname}.mdx`] || allMeta[`${finalPathname}/index.mdx`]
      : allMeta['/index.mdx']

  if (!meta?.path) {
    return null
  }

  return (
    <>
      <Button asChild variant="secondary">
        <Link
          href={`https://github.com/${getRepoBase()}/content/${meta.path}`}
          target="_blank"
          rel="nofollow noreferrer"
        >
          Edit this page on GitHub
        </Link>
      </Button>
    </>
  )
}
