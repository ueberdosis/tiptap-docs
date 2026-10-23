import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Layout } from '@/components/layouts/Layout'
import { createMetadata } from '@/server/createMetadata'
import { PageFrontmatter } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { CopyMarkdownButton } from '@/components/CopyMarkdownButton'

import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { FULL_DOMAIN } from '@/utils/constants'
import { importSidebarConfigFromMarkdownPath } from '@/server/importSidebarConfigFromMarkdownPath'
import { Tag } from '@/components/ui/Tag'
import PrevNextTiles from '@/components/PrevNextTiles'
import { PageHeaderBreadcrumbs } from '@/components/PageHeader.client'
import { AskAi } from '@/components/AskAi'
import { DemoViewer } from '@/components/DemoViewer'

type Props = {
  params: Promise<{
    markdownPath: string[]
  }>
  searchParams: Promise<URLSearchParams>
}

/**
 * Helper function to load MDX file for a given path.
 * Cached per-request to avoid duplicate file checks and imports between generateMetadata and page component.
 */
const loadPageMdx = cache(async (markdownPath: string) => {
  const directPath = `${markdownPath}.mdx`
  const indexPath = `${markdownPath}/index.mdx`

  const hasDirectMdx = fs.existsSync(path.join(process.cwd(), 'src/content', directPath))
  const hasIndexMdx = fs.existsSync(path.join(process.cwd(), 'src/content', indexPath))

  if (!hasDirectMdx && !hasIndexMdx) {
    return null
  }

  const contentPath = hasDirectMdx ? directPath : indexPath
  const pageMdx = (await import(`@/content/${contentPath}`)) as {
    default: () => JSX.Element
    frontmatter?: PageFrontmatter
  }

  return { ...pageMdx, contentPath, schemaDate: new Date().toISOString() }
})

export async function generateMetadata({ params }: Props) {
  const { markdownPath } = await params
  const canonicalUrl = createCanonicalUrl(markdownPath)
  const pageMdx = await loadPageMdx(markdownPath.join('/'))

  if (!pageMdx) {
    return {}
  }

  return await createMetadata({
    title: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    category: pageMdx.frontmatter?.meta?.category,
    ogTitle: pageMdx.frontmatter?.title ?? '',
    canonicalUrl,
    markdownUrl: `${canonicalUrl}.md`,
  })
}

export default async function MarkdownPage({ params }: Props) {
  const { markdownPath } = await params
  const canonicalUrl = createCanonicalUrl(markdownPath)
  const sidebar = await importSidebarConfigFromMarkdownPath(markdownPath)
  const pageMdx = await loadPageMdx(markdownPath.join('/'))

  if (!pageMdx) {
    notFound()
  }

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    url: canonicalUrl,
    datePublished: pageMdx.schemaDate,
    dateModified: pageMdx.schemaDate,
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

  const headerDemo = pageMdx.frontmatter?.headerDemo
  const showSecondarySidebar = !pageMdx.frontmatter?.sidebars?.hideSecondary

  const header = pageMdx.frontmatter ? (
    <PageHeader.Wrapper>
      {sidebar.sidebarConfig ? (
        <div className="flex items-start justify-between flex-wrap gap-y-2 mb-1">
          <PageHeaderBreadcrumbs config={sidebar.sidebarConfig} className="mb-0" />
          <div className="flex items-center gap-2">
            <CopyMarkdownButton title={pageMdx.frontmatter?.title} />
            <AskAi />
          </div>
        </div>
      ) : null}
      {pageMdx.frontmatter?.title ? (
        <PageHeader.Title>{pageMdx.frontmatter.title}</PageHeader.Title>
      ) : null}
      {pageMdx.frontmatter?.intro ? (
        <PageHeader.Intro dangerouslySetInnerHTML={{ __html: pageMdx.frontmatter.intro }} />
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
          isTemplate={markdownPath.includes('templates')}
        />
      ) : null}
      {pageMdx.frontmatter.description ? (
        <PageHeader.Description
          dangerouslySetInnerHTML={{
            __html: pageMdx.frontmatter.description,
          }}
        />
      ) : null}
      {headerDemo ? (
        // The header shows the editor first; its code is one click away
        <div className="mt-8 [&>div]:my-0">
          <DemoViewer
            path={headerDemo.path}
            isPro={headerDemo.isPro}
            src={headerDemo.src}
            isLarge
            view="preview"
          />
          {headerDemo.caption ? (
            <p className="mt-3 text-sm text-grayAlpha-600">{headerDemo.caption}</p>
          ) : null}
        </div>
      ) : null}
    </PageHeader.Wrapper>
  ) : null

  const content = (
    <>
      <div className="mdx-content">{pageMdx.default()}</div>
      <PrevNextTiles
        config={sidebar.sidebarConfig}
        currentPath={`/${markdownPath.join('/')}`}
        isFullWidth={!showSecondarySidebar}
      />
    </>
  )

  return (
    <>
      <Layout.CTA />
      <Layout.Header config={sidebar.sidebarConfig ?? undefined} />
      <Layout.Wrapper>
        {sidebar.sidebarConfig ? <Layout.Sidebar config={sidebar.sidebarConfig} /> : null}
        {headerDemo ? (
          // A demo in the header spans the content and the table of contents, which start below it
          <div className="flex-1 min-w-0 self-start">
            <div className="px-2 sm:px-6 lg:pl-0 lg:pr-12 xl:pr-3 pt-6 sm:pt-8 lg:pt-10">
              {header}
            </div>
            <div className="flex items-start lg:gap-8">
              <Layout.Content contentPath={pageMdx.contentPath} flushTop>
                {content}
              </Layout.Content>
              {showSecondarySidebar ? (
                // Starts level with the content, and keeps the usual gap below the top bar once it sticks
                <Layout.SecondarySidebar className="pt-0 top-[5.75rem] h-[calc(100vh-6.25rem)]" />
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <Layout.Content contentPath={pageMdx.contentPath}>
              {header}
              {content}
            </Layout.Content>
            {showSecondarySidebar ? <Layout.SecondarySidebar /> : null}
          </>
        )}
      </Layout.Wrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      ></script>
    </>
  )
}
