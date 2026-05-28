import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import remarkStringify from 'remark-stringify'
import { visit } from 'unist-util-visit'
import { FULL_DOMAIN } from '@/utils/constants'
import { componentConverters } from './componentConverter'

const ASSET_PREFIXES = ['/assets', '/api', '/_next', '/docsassets']

/**
 * Rewrite internal links so the served markdown is self-contained:
 * doc routes become absolute `.md` URLs (fetchable by agents), assets become
 * absolute URLs, anchors and external links are left untouched.
 */
function rewriteUrl(url: string): string {
  if (!url || url.startsWith('#')) return url
  if (!url.startsWith('/')) return url // external or page-relative — leave as-is

  const isAsset = ASSET_PREFIXES.some((p) => url === p || url.startsWith(`${p}/`))
  if (isAsset) return `${FULL_DOMAIN}${url}`
  
  const [pathPart, hash] = url.split('#')
  const withMd = /\.[a-z0-9]+$/i.test(pathPart) ? pathPart : `${pathPart}.md`
  
  return `${FULL_DOMAIN}${withMd}${hash ? `#${hash}` : ''}`
}

// mdast phrasing (inline) node types. Anything else is flow (block) content.
const PHRASING_TYPES = new Set([
  'text',
  'emphasis',
  'strong',
  'delete',
  'link',
  'linkReference',
  'image',
  'imageReference',
  'inlineCode',
  'break',
  'footnote',
  'footnoteReference',
])

const isPhrasing = (node: any): boolean => PHRASING_TYPES.has(node.type)
const isWhitespaceText = (node: any): boolean =>
  node.type === 'text' && typeof node.value === 'string' && node.value.trim() === ''

/**
 * Make a list of nodes valid in a flow (block) context: wrap each run of
 * phrasing nodes in a paragraph and drop whitespace-only text. Without this,
 * unwrapping a block component (e.g. a `<div>` of `<Link>` cards) leaves bare
 * inline nodes at flow level, which `mdast-util-to-markdown` serializes with no
 * separators — collapsing whole sections onto one line.
 */
function normalizeFlowChildren(nodes: any[]): any[] {
  const out: any[] = []
  let run: any[] = []

  const flush = () => {
    if (run.some((n) => !isWhitespaceText(n))) out.push({ type: 'paragraph', children: run })
    run = []
  }

  for (const node of nodes) {
    if (isPhrasing(node)) {
      run.push(node)
    } else {
      flush()
      out.push(node)
    }
  }
  flush()
  return out
}

/**
 * Unified plugin implementing the filter pipeline: drop imports/expressions,
 * convert JSX components via the registry (unknown ones are unwrapped), and
 * rewrite internal links.
 */
function remarkFilter() {
  // Loose typing: mdast/mdx node shapes are dynamic here.
  return (tree: any) => {
    visit(tree, (node: any, index, parent: any) => {
      if (node.type === 'link' && typeof node.url === 'string') {
        node.url = rewriteUrl(node.url)
        return
      }

      if (!parent || typeof index !== 'number') return

      // Drop imports/exports and bare expressions like {/* comment */}.
      if (
        node.type === 'mdxjsEsm' ||
        node.type === 'mdxFlowExpression' ||
        node.type === 'mdxTextExpression'
      ) {
        parent.children.splice(index, 1)
        return index
      }

      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        const convert = node.name ? componentConverters[node.name] : undefined
        const result = convert ? convert(node) : undefined

        let replacement: any[]
        if (result === null) replacement = []
        else if (result === undefined) replacement = node.children ?? [] // default: unwrap
        else replacement = Array.isArray(result) ? result : [result]

        // A flow element sits in a block context, so its replacement must be
        // block-level: wrap any inline nodes in paragraphs.
        if (node.type === 'mdxJsxFlowElement') {
          replacement = normalizeFlowChildren(replacement)
        }

        parent.children.splice(index, 1, ...replacement)
        // Re-visit at the same index so nested components are transformed too.
        return index
      }
    })
  }
}

/** Compile an MDX body (frontmatter already stripped) to clean markdown. */
export async function transformMdxToMarkdown(body: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .use(remarkFilter)
    .use(remarkStringify, {
      bullet: '-',
      fences: true,
      listItemIndent: 'one',
      rule: '-',
    })
    .process(body)

  return String(file).trim()
}
