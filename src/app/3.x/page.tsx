import { Layout } from '@/components/layouts/Layout'
import { PageHeader } from '@/components/PageHeader'
import { FULL_DOMAIN } from '@/utils/constants'
import { generateVersionedMetadata } from '@/server/generateVersionedMetadata'
import { getVersionedMdx } from '@/server/getVersionedMdx'

export async function generateMetadata() {
  return generateVersionedMetadata([], '3.x')
}

export default async function HomePage() {
  const { mdx, sidebar } = await getVersionedMdx([], '3.x')

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: mdx.frontmatter?.meta?.title ?? mdx.frontmatter?.title ?? '',
    description: mdx.frontmatter?.meta?.description ?? mdx.frontmatter?.description ?? '',
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
      <Layout.Header config={sidebar ?? undefined} prefix="/3.x" />
      <Layout.Wrapper>
        {sidebar ? <Layout.Sidebar config={sidebar} /> : null}
        <Layout.Content>
          {mdx.frontmatter ? (
            <PageHeader.Wrapper>
              {sidebar ? <PageHeader.Breadcrumbs config={sidebar} /> : null}
              <PageHeader.Title>{mdx.frontmatter.title}</PageHeader.Title>
              {mdx.frontmatter?.tags ? <PageHeader.Tags tags={mdx.frontmatter.tags} /> : null}
              {mdx.frontmatter.description ? (
                <PageHeader.Description
                  dangerouslySetInnerHTML={{
                    __html: mdx.frontmatter.description,
                  }}
                />
              ) : null}
            </PageHeader.Wrapper>
          ) : null}
          <div className="mdx-content">{mdx.default()}</div>
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
