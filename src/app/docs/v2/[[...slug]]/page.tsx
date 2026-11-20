import type { Metadata } from 'next';
import { DocsPageContent, getDocsMetadata } from '@/components/docs-page';
import { v2Source } from '@/lib/source';

export default async function Page(props: PageProps<'/docs/v2/[[...slug]]'>) {
  const { slug } = await props.params;
  return <DocsPageContent source={v2Source} contentDir="content/v2" slug={slug} />;
}

export async function generateStaticParams() {
  return v2Source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/docs/v2/[[...slug]]'>,
): Promise<Metadata> {
  return getDocsMetadata(v2Source, (await props.params).slug);
}
