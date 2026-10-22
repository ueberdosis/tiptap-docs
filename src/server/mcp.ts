import fs from 'fs'
import { CATALOG_AREAS, CATALOG_GROUPS, CATALOG_PLANS } from '../content/catalog'
import { createCanonicalUrl } from './createCanonicalUrl'
import { getCatalog } from './getCatalog'
import { DocsPage, fileForRoute, getDocsIndex } from './getDocsIndex'
import { DOCS_SUMMARY, markdownUrl, usageNotes } from './llmsText'
import { changelogToMarkdown } from './markdown/changelogToMarkdown'
import { fileToMarkdown } from './markdown/fileToMarkdown'
import { resolveContentPath } from './markdown/resolveContentPath'
import { BASE_PATH } from '@/utils/constants'

// A read-only MCP server for the docs, over Streamable HTTP with plain JSON
// responses (no event stream). Stateless: every request stands alone.

export const SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05']

type JsonRpcId = string | number | null
type JsonRpcMessage = {
  jsonrpc?: string
  id?: JsonRpcId
  method?: string
  params?: Record<string, unknown>
}
type JsonRpcResponse = {
  jsonrpc: '2.0'
  id: JsonRpcId
  result?: unknown
  error?: { code: number; message: string }
}
type ToolResult = { content: { type: 'text'; text: string }[]; isError?: boolean }

const TOOLS = [
  {
    name: 'search_docs',
    title: 'Search the Tiptap docs',
    description:
      'Find documentation pages by keywords. Returns titles, sections, plans, and Markdown URLs; read a page with get_page.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keywords, such as "comments webhook" or "yjs json"',
        },
        limit: { type: 'number', description: 'Maximum number of results, 1 to 20. Default 8.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_page',
    title: 'Read a docs page',
    description:
      'Return one documentation page as Markdown, with frontmatter that names its section, plan, and status. Accepts a path such as /comments/getting-started/install or a full docs URL.',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Page path or URL' } },
      required: ['path'],
    },
  },
  {
    name: 'list_features',
    title: 'List Tiptap features',
    description:
      'List features from the catalog with their group, plan, and docs URL. Check this before building something Tiptap may already provide.',
    inputSchema: {
      type: 'object',
      properties: {
        area: { type: 'string', enum: Object.keys(CATALOG_AREAS) },
        plan: { type: 'string', enum: [...CATALOG_PLANS] },
        group: { type: 'string', enum: CATALOG_GROUPS.map((group) => group.id) },
        query: { type: 'string', description: 'Filter by name or description' },
      },
    },
  },
]

// Search ------------------------------------------------------------------

type SearchDoc = { page: DocsPage; headings: string; body: string }

let searchDocs: SearchDoc[] | undefined

function getSearchDocs(): SearchDoc[] {
  if (searchDocs) return searchDocs
  searchDocs = getDocsIndex().map((page) => {
    const file = fileForRoute(page.route)
    const raw = file ? fs.readFileSync(file, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '') : ''
    const headings = [...raw.matchAll(/^#{1,4}\s+(.+)$/gm)].map((match) => match[1]).join(' ')
    const body = raw
      .replace(/^import .*$/gm, '')
      .replace(/<[^>]+>/g, ' ')
      .toLowerCase()
    return { page, headings: headings.toLowerCase(), body }
  })
  return searchDocs
}

function count(haystack: string, needle: string): number {
  let total = 0
  for (let at = haystack.indexOf(needle); at !== -1; at = haystack.indexOf(needle, at + 1)) total++
  return total
}

export function searchDocsIndex(query: string, limit = 8): DocsPage[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9.@/-]+/)
    .filter((term) => term.length > 1)
  if (terms.length === 0) return []

  const scored = getSearchDocs().map(({ page, headings, body }) => {
    const title = page.title.toLowerCase()
    const trail = page.trail.join(' ').toLowerCase()
    const description = (page.description ?? '').toLowerCase()
    let score = 0
    let matched = 0
    for (const term of terms) {
      const termScore =
        (title.includes(term) ? 6 : 0) +
        (trail.includes(term) ? 3 : 0) +
        (description.includes(term) ? 3 : 0) +
        (headings.includes(term) ? 2 : 0) +
        Math.min(count(body, term), 5) * 0.4
      if (termScore > 0) matched++
      score += termScore
    }
    // Pages that match every term rank above pages that match some
    if (matched === terms.length) score *= 2
    // Deprecated pages only when nothing current matches as well
    if (page.status === 'Deprecated') score *= 0.3
    return { page, score }
  })

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(Math.max(limit, 1), 20))
    .map(({ page }) => page)
}

// Tools -------------------------------------------------------------------

function text(value: string, isError = false): ToolResult {
  return { content: [{ type: 'text', text: value }], ...(isError ? { isError: true } : {}) }
}

function describe(page: DocsPage): string {
  const meta = [
    page.trail.join(' › '),
    page.plan && page.plan !== 'Open source' ? `plan: ${page.plan}` : '',
    page.status ?? '',
  ]
    .filter(Boolean)
    .join(' · ')
  return [
    `${page.title}${meta ? ` (${meta})` : ''}`,
    `  ${markdownUrl(page.route)}`,
    page.description ? `  ${page.description}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

/** Turns a path or docs URL into a route: no origin, base path, `.md`, or trailing slash. */
export function toRoute(input: string): string {
  let value = input.trim()
  try {
    if (/^https?:\/\//.test(value)) value = new URL(value).pathname
  } catch {
    // Not a URL; treat it as a path
  }
  value = value.split(/[?#]/)[0]
  if (BASE_PATH && value.startsWith(`${BASE_PATH}/`)) value = value.slice(BASE_PATH.length)
  if (value.startsWith('/docs/')) value = value.slice('/docs'.length)
  value = value.replace(/\.mdx?$/, '').replace(/\/+$/, '')
  return value.startsWith('/') ? value || '/' : `/${value}`
}

async function getPage(path: string): Promise<ToolResult> {
  let route = toRoute(path)
  if (route === '/index') route = '/'

  if (route.startsWith('/resources/changelog/')) {
    const slug = route.slice('/resources/changelog/'.length)
    const markdown = changelogToMarkdown(slug, createCanonicalUrl(['resources', 'changelog', slug]))
    if (markdown) return text(markdown)
  }

  const resolved = resolveContentPath(route)
  if (resolved.type === 'redirect') {
    const target = toRoute(resolved.destination)
    const file = fileForRoute(target)
    if (file)
      return text(await fileToMarkdown(file, createCanonicalUrl(target.split('/').filter(Boolean))))
  }
  if (resolved.type === 'file') {
    return text(
      await fileToMarkdown(resolved.filePath, createCanonicalUrl(route.split('/').filter(Boolean))),
    )
  }

  const suggestions = searchDocsIndex(route.split('/').join(' '), 5)
  return text(
    [
      `No page at ${route}.`,
      suggestions.length ? `Pages that may help:\n\n${suggestions.map(describe).join('\n\n')}` : '',
    ]
      .filter(Boolean)
      .join('\n\n'),
    true,
  )
}

function listFeatures(args: Record<string, unknown>): ToolResult {
  const needle = typeof args.query === 'string' ? args.query.toLowerCase() : ''
  const groups = new Map(CATALOG_GROUPS.map((group) => [group.id, group.title]))
  const entries = getCatalog().filter(
    (entry) =>
      (!args.area || entry.area === args.area) &&
      (!args.plan || entry.plan === args.plan) &&
      (!args.group || entry.group === args.group) &&
      (!needle ||
        entry.name.toLowerCase().includes(needle) ||
        entry.description.toLowerCase().includes(needle)),
  )
  if (entries.length === 0) return text('No features match these filters.')
  return text(
    entries
      .map((entry) => {
        const where = entry.url ? markdownUrl(entry.url) : 'no docs yet'
        const plan = entry.plan ?? entry.status ?? ''
        return `- ${entry.name} [${plan}] (${groups.get(entry.group)}): ${entry.description} — ${where}`
      })
      .join('\n'),
  )
}

async function callTool(name: unknown, args: Record<string, unknown>): Promise<ToolResult> {
  switch (name) {
    case 'search_docs': {
      const results = searchDocsIndex(String(args.query ?? ''), Number(args.limit) || 8)
      return results.length
        ? text(results.map(describe).join('\n\n'))
        : text('No pages match. Try fewer or different keywords.')
    }
    case 'get_page':
      return getPage(String(args.path ?? ''))
    case 'list_features':
      return listFeatures(args)
    default:
      throw Object.assign(new Error(`Unknown tool: ${String(name)}`), { code: -32602 })
  }
}

// JSON-RPC ----------------------------------------------------------------

function instructions(): string {
  return [DOCS_SUMMARY, '', ...usageNotes()].join('\n')
}

/** Handles one JSON-RPC message. Returns null for notifications, which get no answer. */
export async function handleMcpMessage(message: JsonRpcMessage): Promise<JsonRpcResponse | null> {
  const id = message.id ?? null
  const isNotification = message.id === undefined
  const reply = (result: unknown): JsonRpcResponse => ({ jsonrpc: '2.0', id, result })
  const fail = (code: number, errorMessage: string): JsonRpcResponse => ({
    jsonrpc: '2.0',
    id,
    error: { code, message: errorMessage },
  })

  if (message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    return isNotification ? null : fail(-32600, 'Invalid request')
  }
  if (isNotification) return null

  try {
    switch (message.method) {
      case 'initialize': {
        const requested = String(message.params?.protocolVersion ?? '')
        return reply({
          protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requested)
            ? requested
            : SUPPORTED_PROTOCOL_VERSIONS[0],
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'tiptap-docs', title: 'Tiptap Docs', version: '1.0.0' },
          instructions: instructions(),
        })
      }
      case 'ping':
        return reply({})
      case 'tools/list':
        return reply({ tools: TOOLS })
      case 'tools/call': {
        const args = (message.params?.arguments ?? {}) as Record<string, unknown>
        return reply(await callTool(message.params?.name, args))
      }
      default:
        return fail(-32601, `Method not found: ${message.method}`)
    }
  } catch (error) {
    const code = (error as { code?: number }).code ?? -32603
    return fail(code, error instanceof Error ? error.message : 'Internal error')
  }
}
