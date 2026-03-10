import { notFound } from 'next/navigation'
import { Layout } from '@/components/layouts/Layout'
import { createMetadata } from '@/server/createMetadata'
import { PageHeader } from '@/components/PageHeader'
import { createCanonicalUrl } from '@/server/createCanonicalUrl'
import { FULL_DOMAIN } from '@/utils/constants'
import { importSidebarConfigFromMarkdownPath } from '@/server/importSidebarConfigFromMarkdownPath'
import PrevNextTiles from '@/components/PrevNextTiles'
import { PageHeaderBreadcrumbs } from '@/components/PageHeader.client'
import { AskAi } from '@/components/AskAi'
import { getChangelogData, getChangelogIndex } from '@/server/getChangelogData'
import { renderMarkdown } from '@/server/renderMarkdown'

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const index = getChangelogIndex()
  return index.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: Props) {
  const data = getChangelogData(params.slug)
  if (!data) return {}

  const title = `${data.packageName} Changelog`
  const description = `Changelog for ${data.packageName} — latest version ${data.version}`
  const canonicalUrl = createCanonicalUrl(['resources', 'changelog', params.slug])

  return await createMetadata({
    title,
    description,
    ogTitle: title,
    canonicalUrl,
  })
}

export default async function ChangelogPage({ params }: Props) {
  const data = getChangelogData(params.slug)
  if (!data) notFound()

  const html = await renderMarkdown(data.content)
  const canonicalUrl = createCanonicalUrl(['resources', 'changelog', params.slug])
  const sidebar = await importSidebarConfigFromMarkdownPath(['resources'])

  const title = `${data.packageName} Changelog`
  const description = `Changelog for ${data.packageName} — latest version ${data.version}`

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
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
          <PageHeader.Wrapper>
            {sidebar.sidebarConfig ? (
              <div className="flex items-start justify-between flex-wrap gap-y-2 mb-4">
                <PageHeaderBreadcrumbs config={sidebar.sidebarConfig} />
                <div className="flex items-center gap-2">
                  <AskAi />
                </div>
              </div>
            ) : null}
            <PageHeader.Title>{title}</PageHeader.Title>
            <PageHeader.Description>{description}</PageHeader.Description>
          </PageHeader.Wrapper>
          <div className="mdx-content" dangerouslySetInnerHTML={{ __html: html }} />
          <PrevNextTiles
            config={sidebar.sidebarConfig}
            currentPath={`/resources/changelog/${params.slug}`}
          />
        </Layout.Content>
        <Layout.SecondarySidebar />
      </Layout.Wrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
    </>
  )
}
