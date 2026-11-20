import { createImageRoute } from '@/lib/og-image';
import { v2Source } from '@/lib/source';

export const revalidate = false;

const route = createImageRoute(v2Source);

export const GET = route.GET;
export const generateStaticParams = route.generateStaticParams;
