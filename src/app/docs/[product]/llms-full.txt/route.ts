import { getLlmsFull, getLlmsProducts, llmsTextHeaders } from '@/lib/llms';

export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return getLlmsProducts().map((product) => ({ product }));
}

export async function GET(
  _req: Request,
  { params }: RouteContext<'/docs/[product]/llms-full.txt'>,
) {
  const { product } = await params;
  return new Response(await getLlmsFull(product), { headers: llmsTextHeaders });
}
