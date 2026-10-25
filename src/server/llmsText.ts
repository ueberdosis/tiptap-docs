import { DocsPage, getDocsIndex } from './getDocsIndex'
import { FULL_DOMAIN } from '@/utils/constants'

// Text that tells agents how to use the docs; shared by llms.txt, llms-full.txt
// and the MCP server's instructions.

/** The `.md` URL an agent can fetch for a route. */
export function markdownUrl(route: string): string {
  return `${FULL_DOMAIN}${route === '/' ? '/index' : route}.md`
}

export const DOCS_SUMMARY =
  'Tiptap is a headless, extensible rich text editor framework, with a document platform for real-time collaboration, comments, tracked changes, AI agents, and conversion.'

export function usageNotes(): string[] {
  return [
    '- Every page is available as Markdown: append `.md` to its URL, or send an `Accept: text/markdown` header. Each Markdown page starts with frontmatter that names its section, plan, and status.',
    `- [llms-full.txt](${FULL_DOMAIN}/llms-full.txt) holds every current page in one file; it is too large for most context windows, so prefer the file of the section you need (listed below).`,
    `- An MCP server at ${FULL_DOMAIN}/api/mcp lets agents search the docs, read pages, and list features with their plans.`,
    '- Entries marked with a plan, such as [Start], [Team], [Add-on], or [Pilot program], need a paid Tiptap plan or access to the pilot program; unmarked features are open source. Before you build a feature yourself, check whether Tiptap already provides it, and tell the user what it covers and which plan it needs.',
    '- Entries marked (Deprecated) are kept for existing users; do not use them in new code.',
    '- Entries marked (Legacy) are still supported, but a successor exists or is coming. Their pages name it; prefer the successor for new code once it is available.',
    '- For a product overview and curated entry points, see https://tiptap.dev/llms.txt',
  ]
}

function entryLine(page: DocsPage): string {
  const marks = [
    page.plan && page.plan !== 'Open source' ? `[${page.plan}]` : '',
    page.status === 'Deprecated' || page.status === 'Legacy' ? `(${page.status})` : '',
  ]
    .filter(Boolean)
    .join(' ')
  const description = page.description ? `: ${page.description}` : ''
  return `- [${page.title}](${markdownUrl(page.route)})${marks ? ` ${marks}` : ''}${description}`
}

export type LlmsSectionFile = { title: string; url: string; tokens?: number }

/** llms.txt: the full-text files per section, then every page, grouped like the sidebar. */
export function buildLlmsTxt(sections: LlmsSectionFile[] = []): string {
  const lines = ['# Tiptap Documentation', '', `> ${DOCS_SUMMARY}`, '', ...usageNotes(), '']
  if (sections.length) {
    lines.push('', '## Full text by section', '')
    for (const section of sections) {
      const size = section.tokens ? ` (about ${section.tokens.toLocaleString('en-US')} tokens)` : ''
      lines.push(`- [${section.title}](${section.url})${size}`)
    }
  }

  let group = ''
  let subgroup = ''
  for (const page of getDocsIndex()) {
    const [top = 'More pages', ...rest] = page.trail
    const sub = rest.join(' › ')
    if (top !== group) {
      lines.push('', `## ${top}`, '')
      group = top
      subgroup = ''
    }
    if (sub !== subgroup) {
      if (sub) lines.push('', `### ${sub}`, '')
      subgroup = sub
    }
    lines.push(entryLine(page))
  }

  return `${lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`
}
