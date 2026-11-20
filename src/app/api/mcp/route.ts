import { NextRequest, NextResponse } from 'next/server'
import { handleMcpMessage } from '@/server/mcp'

// MCP over Streamable HTTP: clients POST JSON-RPC messages and get JSON back.
// The server keeps no sessions and offers no event stream.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } },
      { status: 400 },
    )
  }

  const messages = Array.isArray(body) ? body : [body]
  const responses = (
    await Promise.all(messages.map((message) => handleMcpMessage(message)))
  ).filter((response) => response !== null)

  // Notifications and responses from the client need no answer
  if (responses.length === 0) return new NextResponse(null, { status: 202 })
  return NextResponse.json(Array.isArray(body) ? responses : responses[0])
}

export function GET() {
  return new NextResponse('This MCP server answers POST requests only.', {
    status: 405,
    headers: { Allow: 'POST' },
  })
}
