import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { Layout } from '@/components/layouts/Layout'
import { createMetadata } from '@/server/createMetadata'
import { PageFrontmatter } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { FULL_DOMAIN } from '@/utils/constants'
import { importSidebarConfigFromMarkdownPath } from '@/server/importSidebarConfigFromMarkdownPath'

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

  const hasDirectMdx = fs.existsSync(path.join(process.cwd(), 'src/content', directPath))
  const hasIndexMdx = fs.existsSync(path.join(process.cwd(), 'src/content', indexPath))

  if (!hasDirectMdx && !hasIndexMdx) {
    // Return a 404 page if the markdown file doesn't exist
    // give Next error page
    return {}
  }

  const pageMdx = (await import(`@/content/${hasDirectMdx ? directPath : indexPath}`)) as {
    default: () => JSX.Element
    frontmatter?: PageFrontmatter
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
  const directPath = `${params.markdownPath.join('/')}.mdx`
  const indexPath = `${params.markdownPath.join('/')}/index.mdx`

  const canonicalUrl = createCanonicalUrl(params.markdownPath)
  const sidebar = await importSidebarConfigFromMarkdownPath(params.markdownPath)

  const hasDirectMdx = fs.existsSync(path.join(process.cwd(), 'src/content', directPath))
  const hasIndexMdx = fs.existsSync(path.join(process.cwd(), 'src/content', indexPath))

  if (!hasDirectMdx && !hasIndexMdx) {
    // Return a 404 page if the markdown file doesn't exist
    // give Next error page
    notFound()
  }

  const pageMdx = (await import(`@/content/${hasDirectMdx ? directPath : indexPath}`)) as {
    default: () => JSX.Element
    frontmatter?: PageFrontmatter
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
                <PageHeader.Breadcrumbs config={sidebar.sidebarConfig} />
              ) : null}
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
