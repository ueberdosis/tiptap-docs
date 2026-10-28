import { cache } from 'react'
import { Layout } from '@/components/layouts/Layout'
import { PageHeader } from '@/components/PageHeader'
import { PageHeaderBreadcrumbs } from '@/components/PageHeader.client'
import PrevNextTiles from '@/components/PrevNextTiles'
import { CopyMarkdownButton } from '@/components/CopyMarkdownButton'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { createMetadata } from '@/server/createMetadata'
import { importSidebarConfigFromMarkdownPath } from '@/server/importSidebarConfigFromMarkdownPath'
import { PageFrontmatter } from '@/types'
import { FULL_DOMAIN } from '@/utils/constants'
import { AskAi } from '@/components/AskAi'

const loadHomeMdx = cache(async () => {
  const pageMdx = (await import('@/content/index.mdx')) as {
    default: () => JSX.Element
    frontmatter?: PageFrontmatter
  }
  return { ...pageMdx, schemaDate: new Date().toISOString() }
})

export async function generateMetadata() {
  const pageMdx = await loadHomeMdx()

  const canonicalUrl = createCanonicalUrl([])

  return await createMetadata({
    title: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    ogTitle: pageMdx.frontmatter?.title ?? '',
    canonicalUrl,
  })
}

export default async function HomePage() {
  const pageMdx = await loadHomeMdx()
  const sidebar = await importSidebarConfigFromMarkdownPath([])

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    url: FULL_DOMAIN,
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

  return (
    <>
      <Layout.CTA />
      <Layout.Header config={sidebar.sidebarConfig} />
      <Layout.Wrapper>
        {sidebar.sidebarConfig ? <Layout.Sidebar config={sidebar.sidebarConfig} /> : null}
        <Layout.Content contentPath="index.mdx">
          {pageMdx.frontmatter ? (
            <PageHeader.Wrapper>
              {sidebar.sidebarConfig ? (
                <div className="flex items-start justify-between flex-wrap gap-y-2 mb-4">
                  <PageHeaderBreadcrumbs config={sidebar.sidebarConfig} />
                  <div className="flex items-center gap-2">
                    <CopyMarkdownButton title={pageMdx.frontmatter?.title} />
                    <AskAi />
                  </div>
                </div>
              ) : null}
              <PageHeader.Title>{pageMdx.frontmatter.title}</PageHeader.Title>
              {pageMdx.frontmatter?.tags ? (
                <PageHeader.Tags tags={pageMdx.frontmatter.tags} />
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
          <PrevNextTiles config={sidebar.sidebarConfig} currentPath="/" />
        </Layout.Content>
        <Layout.SecondarySidebar />
      </Layout.Wrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      ></script>
    </>
  )
}
