import { Layout } from '@/components/layouts/Layout'
import { createMetadata } from '@/server/createMetadata'
import { PageHeader } from '@/components/PageHeader'
import { sidebarConfig } from '@/content/v3/sidebar'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { FULL_DOMAIN } from '@/utils/constants'
import { importMdxFromPath } from '@/utils/versioning'

export async function generateMetadata() {
  const pageMdx = await importMdxFromPath('v3', 'index.mdx')

  const canonicalUrl = createCanonicalUrl([])

  return await createMetadata({
    title: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    ogTitle: pageMdx.frontmatter?.title ?? '',
    canonicalUrl,
  })
}

export default async function HomePage() {
  const pageMdx = await importMdxFromPath('v3', 'index.mdx')

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
      <Layout.Header config={sidebarConfig} prefix="/v3" />
      <Layout.Wrapper>
        <Layout.Sidebar config={sidebarConfig} />
        <Layout.Content>
          {pageMdx.frontmatter ? (
            <PageHeader.Wrapper>
              {<PageHeader.Breadcrumbs config={sidebarConfig} />}
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
