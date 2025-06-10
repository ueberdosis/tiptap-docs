import { Layout } from '@/components/layouts/Layout'
import { createMetadata } from '@/server/createMetadata'
import { PageFrontmatter } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { sidebarConfig } from '@/content/sidebar'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'
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
      <Layout.Header config={sidebarConfig} />
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
