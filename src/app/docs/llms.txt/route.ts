import { getLlmsIndex, llmsTextHeaders } from '@/lib/llms';

export const revalidate = false;

export function GET() {
  return new Response(getLlmsIndex(), { headers: llmsTextHeaders });
}
