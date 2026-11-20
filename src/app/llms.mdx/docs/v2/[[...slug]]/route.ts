import { notFound } from 'next/navigation';
import { getPageMarkdown, markdownResponse, markdownVersions } from '@/lib/llms';
import { getPageMarkdownUrl } from '@/lib/shared';

export const revalidate = false;

const version = markdownVersions.v2;

export async function GET(
  _req: Request,
  { params }: RouteContext<'/llms.mdx/docs/v2/[[...slug]]'>,
) {
  const { slug } = await params;
  const page = version.source.getPage(slug?.slice(0, -1));
  if (!page) notFound();

  return markdownResponse(await getPageMarkdown(page, version));
}

export function generateStaticParams() {
  return version.source.getPages().map((page) => ({ slug: getPageMarkdownUrl(page).segments }));
}
