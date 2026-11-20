import { docsLlms } from '@/lib/llms';
import { createDocsMcpRoute } from '@/lib/mcp';
import { source } from '@/lib/source';

export const { GET, POST, DELETE } = createDocsMcpRoute('tiptap-docs', source, docsLlms);
