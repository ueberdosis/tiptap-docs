import type { Metadata } from 'next';
import { DocsPageContent, getDocsMetadata } from '@/components/docs-page';
import { source } from '@/lib/source';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const { slug } = await props.params;
  return <DocsPageContent source={source} contentDir="content/docs" slug={slug} />;
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  return getDocsMetadata(source, (await props.params).slug);
}
