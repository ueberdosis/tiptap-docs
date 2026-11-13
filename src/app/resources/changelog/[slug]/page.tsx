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
import { PackageTimeline } from '@/components/Changelog'
import Link from '@/components/Link'
import { packageDisplayName } from '@/server/changelogEntries'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  const index = getChangelogIndex()
  return index.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const data = getChangelogData(slug)
  if (!data) return {}

  const title = `${packageDisplayName(data.packageName)} changelog`
  const description = `Every version of ${data.packageName} that changed something, newest first.`
  const canonicalUrl = createCanonicalUrl(['resources', 'changelog', slug])

  return await createMetadata({
    title,
    description,
    ogTitle: title,
    canonicalUrl,
  })
}

export default async function ChangelogPage({ params }: Props) {
  const { slug } = await params
  const data = getChangelogData(slug)
  if (!data) notFound()

  const canonicalUrl = createCanonicalUrl(['resources', 'changelog', slug])
  const sidebar = await importSidebarConfigFromMarkdownPath(['resources'])

  const name = packageDisplayName(data.packageName)
  const title = `${name} changelog`
  const description = `Every version of ${data.packageName} that changed something, newest first.`
  const schemaDate = '1970-01-01T00:00:00.000Z'

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: canonicalUrl,
    datePublished: schemaDate,
    dateModified: schemaDate,
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
              <div className="flex items-start justify-between flex-wrap gap-y-2 mb-1">
                <PageHeaderBreadcrumbs config={sidebar.sidebarConfig} className="mb-0" />
                <div className="flex items-center gap-2">
                  <AskAi />
                </div>
              </div>
            ) : null}
            <PageHeader.Title>{title}</PageHeader.Title>
            <PageHeader.Intro>
              Every version of <code>{data.packageName}</code> that changed something, newest first.
              All releases are on the <Link href="/resources/changelog">changelog</Link>.
            </PageHeader.Intro>
          </PageHeader.Wrapper>
          <div className="mdx-content">
            <PackageTimeline slug={slug} />
          </div>
          <PrevNextTiles
            config={sidebar.sidebarConfig}
            currentPath={`/resources/changelog/${slug}`}
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
