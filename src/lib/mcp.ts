import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { registerSearchTool, registerSourceTools } from 'fumadocs-core/mcp';
import { createFromSource } from 'fumadocs-core/search/server';
import type { docsLlms } from '@/lib/llms';
import type { DocsSource } from '@/lib/source';

/** Read-only MCP route handlers (`list_pages`, `get_page`, `search`) for one docs version. */
export function createDocsMcpRoute(name: string, source: DocsSource, llms: typeof docsLlms) {
  const handler = createMcpHandler(() => {
    const mcp = new McpServer(
      { name, version: '1.0.0' },
      // the tools never change, a stream to watch them would hold a serverless function open
      { capabilities: { tools: { listChanged: false } } },
    );

    registerSourceTools(mcp, source, llms);
    registerSearchTool(mcp, createFromSource(source));

    return mcp;
  });

  const handle = (request: Request) => handler.fetch(request);
  return { GET: handle, POST: handle, DELETE: handle };
}
