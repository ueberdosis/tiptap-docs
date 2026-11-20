import { notFound } from 'next/navigation';
import { getPageMarkdown, getPageUrl, markdownResponse, markdownVersions } from '@/lib/llms';
import { getPageMarkdownUrl } from '@/lib/shared';

export const revalidate = false;

const version = markdownVersions.latest;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = version.source.getPage(slug?.slice(0, -1));
  if (!page) notFound();

  return markdownResponse(await getPageMarkdown(page, version), getPageUrl(page));
}

export function generateStaticParams() {
  return version.source.getPages().map((page) => ({ slug: getPageMarkdownUrl(page).segments }));
}
