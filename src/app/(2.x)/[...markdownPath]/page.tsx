import fs from 'fs'
import { notFound } from 'next/navigation'
import { Layout } from '@/components/layouts/Layout'
import { createMetadata } from '@/server/createMetadata'
import { SidebarConfig } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { FULL_DOMAIN } from '@/utils/constants'
import { getImportPathForVersion, importMdxFromPath } from '@/utils/versioning'

type Props = {
  params: {
    markdownPath: string[]
  }
  searchParams: URLSearchParams
}

export async function generateMetadata({ params }: Props) {
  const directPath = `${params.markdownPath.join('/')}.mdx`
  const indexPath = `${params.markdownPath.join('/')}/index.mdx`

  const canonicalUrl = createCanonicalUrl(params.markdownPath)

  const hasDirectMdx = fs.existsSync(getImportPathForVersion('2.x', directPath))
  const hasIndexMdx = fs.existsSync(getImportPathForVersion('2.x', indexPath))

  if (!hasDirectMdx && !hasIndexMdx) {
    // Return a 404 page if the markdown file doesn't exist
    // give Next error page
    return {}
  }

  const pageMdx = await importMdxFromPath('2.x', hasDirectMdx ? directPath : indexPath)

  return await createMetadata({
    title: pageMdx.frontmatter?.meta?.title ?? pageMdx.frontmatter?.title ?? '',
    description: pageMdx.frontmatter?.meta?.description ?? pageMdx.frontmatter?.description ?? '',
    category: pageMdx.frontmatter?.meta?.category,
    ogTitle: pageMdx.frontmatter?.title ?? '',
    canonicalUrl,
  })
}

export default async function MarkdownPage({ params }: Props) {
  const directPath = `${params.markdownPath.join('/')}.mdx`
  const indexPath = `${params.markdownPath.join('/')}/index.mdx`

  let sidebar: SidebarConfig | null = null
  let steppedSegments = []

  const canonicalUrl = createCanonicalUrl(params.markdownPath)

  ;['', ...params.markdownPath].forEach((segment) => {
    steppedSegments.push(segment)

    const filePath = getImportPathForVersion('2.x', ...steppedSegments, 'sidebar.ts')

    const fileExists = fs.existsSync(filePath)

    if (fileExists) {
      const isIndex = steppedSegments[steppedSegments.length - 1] === ''
      const importPath = isIndex
        ? 'sidebar'
        : `${steppedSegments.filter((s) => s !== '').join('/')}/sidebar`
      sidebar = require(`@/content/2.x/${importPath}`).sidebarConfig as SidebarConfig
    }
  })

  const hasDirectMdx = fs.existsSync(getImportPathForVersion('2.x', directPath))
  const hasIndexMdx = fs.existsSync(getImportPathForVersion('2.x', indexPath))

  if (!hasDirectMdx && !hasIndexMdx) {
    // Return a 404 page if the markdown file doesn't exist
    // give Next error page
    notFound()
  }

  const pageMdx = await importMdxFromPath('2.x', hasDirectMdx ? directPath : indexPath)

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
      <Layout.Header config={sidebar ?? undefined} />
      <Layout.Wrapper>
        {sidebar ? <Layout.Sidebar config={sidebar} /> : null}
        <Layout.Content>
          {pageMdx.frontmatter ? (
            <PageHeader.Wrapper>
              {sidebar ? <PageHeader.Breadcrumbs config={sidebar} /> : null}
              {pageMdx.frontmatter?.title ? (
                <PageHeader.Title>{pageMdx.frontmatter.title}</PageHeader.Title>
              ) : null}
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
        {!pageMdx.frontmatter?.sidebars?.hideSecondary ? <Layout.SecondarySidebar /> : null}
      </Layout.Wrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      ></script>
    </>
  )
}
