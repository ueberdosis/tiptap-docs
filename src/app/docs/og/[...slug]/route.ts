import { createImageRoute } from '@/lib/og-image';
import { source } from '@/lib/source';

export const revalidate = false;

const route = createImageRoute(source);

export const GET = route.GET;
export const generateStaticParams = route.generateStaticParams;
