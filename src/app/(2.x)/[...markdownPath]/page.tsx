import { Layout } from '@/components/layouts/Layout'
import { PageHeader } from '@/components/PageHeader'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { FULL_DOMAIN } from '@/utils/constants'
import { generateVersionedMetadata } from '@/server/generateVersionedMetadata'
import { getVersionedMdx } from '@/server/getVersionedMdx'

type Props = {
  params: {
    markdownPath: string[]
  }
  searchParams: URLSearchParams
}

export async function generateMetadata({ params }: Props) {
  return await generateVersionedMetadata(params.markdownPath, '2.x')
}

export default async function MarkdownPage({ params }: Props) {
  const canonicalUrl = createCanonicalUrl(params.markdownPath)
  const { mdx, sidebar } = await getVersionedMdx(params.markdownPath, '2.x')

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: mdx.frontmatter?.meta?.title ?? mdx.frontmatter?.title ?? '',
    description: mdx.frontmatter?.meta?.description ?? mdx.frontmatter?.description ?? '',
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
      <Layout.Header config={sidebar ?? undefined} />
      <Layout.Wrapper>
        {sidebar ? <Layout.Sidebar config={sidebar} /> : null}
        <Layout.Content>
          {mdx.frontmatter ? (
            <PageHeader.Wrapper>
              {sidebar ? <PageHeader.Breadcrumbs config={sidebar} /> : null}
              {mdx.frontmatter?.title ? (
                <PageHeader.Title>{mdx.frontmatter.title}</PageHeader.Title>
              ) : null}
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
        {!mdx.frontmatter?.sidebars?.hideSecondary ? <Layout.SecondarySidebar /> : null}
      </Layout.Wrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      ></script>
    </>
  )
}
