import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Suspense, cache } from 'react'
import { Layout } from '@/components/layouts/Layout'
import { createMetadata } from '@/server/createMetadata'
import { PageFrontmatter } from '@/types'
import { PageHeader } from '@/components/PageHeader'

import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { FULL_DOMAIN } from '@/utils/constants'
import { importSidebarConfigFromMarkdownPath } from '@/server/importSidebarConfigFromMarkdownPath'
import { Tag } from '@/components/ui/Tag'
import PrevNextTiles from '@/components/PrevNextTiles'
import { PageHeaderBreadcrumbs } from '@/components/PageHeader.client'
import { AskAi } from '@/components/AskAi'

const CopyMarkdownButton = dynamic(
  () => import('@/components/CopyMarkdownButton').then((mod) => mod.CopyMarkdownButton),
  {
    ssr: false,
  },
)

type Props = {
  params: {
    markdownPath: string[]
  }
  searchParams: URLSearchParams
}

/**
 * Helper function to load MDX file for a given path.
 * Cached per-request to avoid duplicate file checks and imports between generateMetadata and page component.
 */
const loadPageMdx = cache(async (markdownPath: string[]) => {
  const directPath = `${markdownPath.join('/')}.mdx`
  const indexPath = `${markdownPath.join('/')}/index.mdx`

  const hasDirectMdx = fs.existsSync(path.join(process.cwd(), 'src/content', directPath))
  const hasIndexMdx = fs.existsSync(path.join(process.cwd(), 'src/content', indexPath))

  if (!hasDirectMdx && !hasIndexMdx) {
    return null
  }

  const pageMdx = (await import(`@/content/${hasDirectMdx ? directPath : indexPath}`)) as {
    default: () => JSX.Element
    frontmatter?: PageFrontmatter
  }

  return pageMdx
})

export async function generateMetadata({ params }: Props) {
  const canonicalUrl = createCanonicalUrl(params.markdownPath)
  const pageMdx = await loadPageMdx(params.markdownPath)

  if (!pageMdx) {
    return {}
  }

  return await createMetadata({
    title: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    category: pageMdx.frontmatter?.meta?.category,
    ogTitle: pageMdx.frontmatter?.title ?? '',
    canonicalUrl,
  })
}

export default async function MarkdownPage({ params }: Props) {
  const canonicalUrl = createCanonicalUrl(params.markdownPath)
  const sidebar = await importSidebarConfigFromMarkdownPath(params.markdownPath)
  const pageMdx = await loadPageMdx(params.markdownPath)

  if (!pageMdx) {
    notFound()
  }

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    url: canonicalUrl,
    datePublished: new Date(Date.now()).toISOString(),
    dateModified: new Date(Date.now()).toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'Tiptap',
      url: 'https://tiptap.dev',
      logo: {
        '@type': 'ImageObject',
        url: `${FULL_DOMAIN}/assets/images/tiptap-logo.png`,
      },
    },
  }

  return (
    <>
      <Layout.CTA />
      <Layout.Header config={sidebar.sidebarConfig ?? undefined} />
      <Layout.Wrapper>
        {sidebar.sidebarConfig ? <Layout.Sidebar config={sidebar.sidebarConfig} /> : null}
        <Layout.Content>
          {pageMdx.frontmatter ? (
            <PageHeader.Wrapper>
              {sidebar.sidebarConfig ? (
                <div className="flex items-start justify-between flex-wrap gap-y-2 mb-4">
                  <PageHeaderBreadcrumbs config={sidebar.sidebarConfig} />
                  <div className="flex items-center gap-2">
                    <Suspense>
                      <CopyMarkdownButton
                        title={pageMdx.frontmatter?.title}
                        content={pageMdx.default()}
                      />
                    </Suspense>
                    <AskAi />
                  </div>
                </div>
              ) : null}
              {pageMdx.frontmatter?.title ? (
                <PageHeader.Title>{pageMdx.frontmatter.title}</PageHeader.Title>
              ) : null}
              {pageMdx.frontmatter?.incident?.severity &&
              ['high', 'critical'].includes(pageMdx.frontmatter.incident.severity) ? (
                <div className="mt-6">
                  <Tag variant="warning">
                    Severity:{' '}
                    {pageMdx.frontmatter.incident.severity.charAt(0).toUpperCase() +
                      pageMdx.frontmatter.incident.severity.slice(1)}
                  </Tag>
                </div>
              ) : null}
              {pageMdx.frontmatter?.tags ? (
                <PageHeader.Tags
                  tags={pageMdx.frontmatter.tags}
                  isTemplate={params.markdownPath.includes('templates')}
                />
              ) : null}
              {pageMdx.frontmatter.description ? (
                <PageHeader.Description
                  dangerouslySetInnerHTML={{
                    __html: pageMdx.frontmatter.description,
                  }}
                />
              ) : null}
            </PageHeader.Wrapper>
          ) : null}
          <div className="mdx-content">{pageMdx.default()}</div>
          <PrevNextTiles
            config={sidebar.sidebarConfig}
            currentPath={`/${params.markdownPath.join('/')}`}
            isFullWidth={!!pageMdx.frontmatter?.sidebars?.hideSecondary}
          />
        </Layout.Content>
        {!pageMdx.frontmatter?.sidebars?.hideSecondary ? <Layout.SecondarySidebar /> : null}
      </Layout.Wrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      ></script>
    </>
  )
}
