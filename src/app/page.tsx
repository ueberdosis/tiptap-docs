import { CopyMarkdownButton } from '@/components/CopyMarkdownButton'
import { Layout } from '@/components/layouts/Layout'
import { PageHeader } from '@/components/PageHeader'
import { PageHeaderBreadcrumbs } from '@/components/PageHeader.client'
import PrevNextTiles from '@/components/PrevNextTiles'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { createMetadata } from '@/server/createMetadata'
import { importSidebarConfigFromMarkdownPath } from '@/server/importSidebarConfigFromMarkdownPath'
import { PageFrontmatter } from '@/types'
import { FULL_DOMAIN } from '@/utils/constants'

export async function generateMetadata() {
  // @ts-ignore
  const pageMdx = (await import(`@/content/index.mdx`)) as {
    default: () => JSX.Element
    frontmatter?: PageFrontmatter
  }

  const canonicalUrl = createCanonicalUrl([])

  return await createMetadata({
    title: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    ogTitle: pageMdx.frontmatter?.title ?? '',
    canonicalUrl,
  })
}

export default async function HomePage() {
  const pageMdx = (await import(`@/content/index.mdx`)) as {
    default: () => JSX.Element
    frontmatter?: PageFrontmatter
  }
  const sidebar = await importSidebarConfigFromMarkdownPath([])

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    url: FULL_DOMAIN,
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
      <Layout.Header config={sidebar.sidebarConfig} />
      <Layout.Wrapper>
        {sidebar.sidebarConfig ? <Layout.Sidebar config={sidebar.sidebarConfig} /> : null}
        <Layout.Content>
          {pageMdx.frontmatter ? (
            <PageHeader.Wrapper>
              {sidebar.sidebarConfig ? (
                <div className="flex items-start justify-between flex-wrap gap-y-2 mb-4">
                  <PageHeaderBreadcrumbs config={sidebar.sidebarConfig} />
                  <CopyMarkdownButton markdownPath={['index']} />
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
