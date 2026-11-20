import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/spacious/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EnterpriseCardBox, type EnterpriseVariant } from '@/components/enterprise-card';
import { JsonLd } from '@/components/json-ld';
import { getMDXComponents } from '@/components/mdx';
import { PageTags } from '@/components/page-tags';
import { pageMetaDescription, pageMetaTitle } from '@/lib/page-meta';
import type { EnterpriseCardData } from '@/lib/remark-enterprise-cards';
import {
  docsImageRoute,
  docsV2ImageRoute,
  getPageImageUrl,
  getPageMarkdownUrl,
  gitConfig,
  ogImageSize,
  siteUrl,
} from '@/lib/shared';
import { type DocsSource, source as latestSource } from '@/lib/source';
import { getBreadcrumbJsonLd, getTechArticleJsonLd } from '@/lib/structured-data';

// Fumadocs' page action buttons at the labels' height, so labels and actions read as one row
const pageAction = 'h-5.5 py-0 px-2';

type DocsPageProps = {
  source: DocsSource;
  /** Folder of the pages, for example `content/docs`. */
  contentDir: string;
  slug?: string[];
};

/** Page template for one docs version. */
export function DocsPageContent({ source, contentDir, slug }: DocsPageProps) {
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const enterpriseCards =
    (page.data._exports.enterpriseCards as EnterpriseCardData[] | undefined) ?? [];
  const markdownUrl = getPageMarkdownUrl(page).url;
  const version = source === latestSource ? 'latest' : 'v2';
  const structuredPage = { ...page.data, url: page.url };

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      // Keeps paragraphs, lists, headings and quotes 760px wide on a full page, so lines stay easy
      // to read. Cards, tables, code and demos use the full width.
      className={
        page.data.full
          ? 'prose-p:max-w-[760px] prose-ul:max-w-[760px] prose-ol:max-w-[760px] prose-headings:max-w-[760px] prose-blockquote:max-w-[760px]'
          : undefined
      }
      tableOfContent={{
        // Starts below a block that also takes its column (`TocSpan`)
        container: { className: 'mt-[var(--toc-offset,0px)]' },
        footer:
          enterpriseCards.length > 0
            ? enterpriseCards.map((card) => (
                <EnterpriseCardBox
                  key={card.variant}
                  variant={card.variant as EnterpriseVariant}
                  disableWaitlist={card.disableWaitlist}
                  className="mt-6"
                />
              ))
            : undefined,
      }}
    >
      <JsonLd data={getTechArticleJsonLd(structuredPage, version)} />
      <JsonLd data={getBreadcrumbJsonLd(structuredPage, version)} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      {/* Labels and page actions in one row, so the page starts sooner */}
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b pb-6">
        <PageTags
          tags={page.data.tags}
          severity={page.data.incident?.severity}
          version={version}
          isTemplate={page.slugs.includes('templates')}
        />
        {/* A thin line between labels and actions, only when there are labels. Not on phones,
            where the actions wrap to their own line. */}
        <div className="flex flex-row items-center gap-1.5 sm:not-first:before:mx-1.5 sm:not-first:before:h-4 sm:not-first:before:w-px sm:not-first:before:bg-fd-border">
          <MarkdownCopyButton markdownUrl={markdownUrl} className={pageAction} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${contentDir}/${page.path}`}
            className={pageAction}
          />
        </div>
      </div>
      {/* List items 0.25em apart instead of 0.5em, so a list reads as one block */}
      <DocsBody className="prose-li:my-[0.25em]">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

/** Page metadata for one docs version. */
export function getDocsMetadata(source: DocsSource, slug?: string[]): Metadata {
  const page = source.getPage(slug);
  if (!page) notFound();

  const isLatest = source === latestSource;
  const url = siteUrl + page.url;
  const image = siteUrl + getPageImageUrl(page, isLatest ? docsImageRoute : docsV2ImageRoute).url;
  const title = pageMetaTitle(page.data);
  const description = pageMetaDescription(page.data);

  return {
    title,
    description,
    alternates: {
      canonical: isLatest ? url : undefined,
      types: { 'text/markdown': siteUrl + getPageMarkdownUrl(page).url },
    },
    openGraph: {
      title,
      description,
      url: isLatest ? url : undefined,
      images: [{ url: image, ...ogImageSize }],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
