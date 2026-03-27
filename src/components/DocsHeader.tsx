'use client'

import { usePathname } from 'next/navigation'
import type { PageMeta, SidebarConfig } from '@/types'
import { PageHeader } from './PageHeader'

type DocsHeaderProps = {
  allMeta: Record<string, PageMeta>
  sidebarConfig: SidebarConfig
}

export const DocsHeader = ({ allMeta, sidebarConfig }: DocsHeaderProps) => {
  const pathname = usePathname()
  const meta = allMeta[pathname]

  if (!meta) {
    return null
  }

  return (
    <PageHeader.Wrapper>
      <PageHeader.Breadcrumbs config={sidebarConfig} />
      <PageHeader.Title>{meta.pageTitle}</PageHeader.Title>
      {meta.pageDescription ? (
        <PageHeader.Description
          dangerouslySetInnerHTML={{
            __html: meta.pageDescription,
          }}
        />
      ) : null}
    </PageHeader.Wrapper>
  )
}
