'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from './Button'
import { PageMeta } from '@/types'
import { getRepoBase } from '@/utils'

export const PageEditStatus = ({
  allMeta,
}: {
  allMeta: Record<string, PageMeta & { path: string }>
}) => {
  const pathname = usePathname()
  const meta =
    pathname !== '/'
      ? allMeta[`${pathname}.mdx`] || allMeta[`${pathname}/index.mdx`]
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
