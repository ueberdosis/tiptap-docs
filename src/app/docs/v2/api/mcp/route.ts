import { v2Llms } from '@/lib/llms';
import { createDocsMcpRoute } from '@/lib/mcp';
import { v2Source } from '@/lib/source';

export const { GET, POST, DELETE } = createDocsMcpRoute('tiptap-docs-v2', v2Source, v2Llms);
