import { DEMO_URL, PRO_DEMO_URL } from '@/utils/constants'

/**
 * Markdown component converter: converters that turn MDX JSX components into plain
 * markdown nodes.
 *
 * Each converter receives an MDX JSX node (mdast `mdxJsxFlowElement` /
 * `mdxJsxTextElement`) and returns the markdown node(s) to put in its place:
 *   - an array of nodes / a single node  → replace
 *   - `null`                             → drop entirely
 *   - `undefined`                        → fall back to the default behavior
 *
 * To support a new embedded component, add an entry here. Components without a
 * converter are "unwrapped": the wrapper is dropped and its children are kept
 * and re-visited (so nested components are still transformed).
 */

// Loose typing keeps converters readable; mdast/mdx node shapes are stable enough.
type MdxNode = {
  type: string
  name?: string | null
  attributes?: Array<{ type: string; name?: string; value?: unknown }>
  children?: MdxNode[]
  value?: string
}

export type ComponentConverter = (node: MdxNode) => MdxNode | MdxNode[] | null | undefined

/** Read a string-valued JSX attribute (ignores expression-valued attributes). */
function getAttr(node: MdxNode, name: string): string | undefined {
  const attr = node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name)
  if (!attr) return undefined
  if (typeof attr.value === 'string') return attr.value
  // Expression value, e.g. path={`/x`} — grab the raw inner source if present.
  if (attr.value && typeof attr.value === 'object' && 'value' in attr.value) {
    return String((attr.value as { value: unknown }).value)
  }
  return undefined
}

/** Whether a string-valued boolean attribute is present (e.g. `isPro`). */
function hasFlag(node: MdxNode, name: string): boolean {
  return !!node.attributes?.some((a) => a.type === 'mdxJsxAttribute' && a.name === name)
}

const text = (value: string): MdxNode => ({ type: 'text', value })
const paragraph = (children: MdxNode[]): MdxNode => ({ type: 'paragraph', children })
const strong = (value: string): MdxNode => ({ type: 'strong', children: [text(value)] })
const link = (url: string, label: string): MdxNode => ({
  type: 'link',
  // mdast link nodes carry `url`; cast through unknown to satisfy the loose type.
  ...({ url } as object),
  children: [text(label)],
})

/** Derive a human label for a demo from its props or path. */
function demoLabel(node: MdxNode, url: string): string {
  const explicit = getAttr(node, 'externalTitle') || getAttr(node, 'caption')
  if (explicit) return explicit
  const last = url.split('?')[0].split('/').filter(Boolean).pop()
  return last ? last.replace(/[-_]/g, ' ') : 'Open demo'
}

export const componentConverters: Record<string, ComponentConverter> = {
  // <CodeDemo path="/Examples/Minimal" /> → blockquote linking to the live demo.
  CodeDemo: (node) => {
    const src = getAttr(node, 'src')
    const path = getAttr(node, 'path') ?? ''
    const url = src ?? (hasFlag(node, 'isPro') ? PRO_DEMO_URL : DEMO_URL) + path
    return {
      type: 'blockquote',
      children: [paragraph([strong('Interactive demo:'), text(' '), link(url, demoLabel(node, url))])],
    }
  },

  // <Callout>…</Callout> → blockquote, prefixed by its type/title when present.
  Callout: (node) => {
    const title = getAttr(node, 'title')
    const type = getAttr(node, 'type') ?? getAttr(node, 'variant')
    const heading = title ?? (type ? type[0].toUpperCase() + type.slice(1) : undefined)
    const children = [...(node.children ?? [])]
    if (heading) children.unshift(paragraph([strong(`${heading}:`)]))
    return { type: 'blockquote', children }
  },

  // <Requirements><RequirementItem label="…">…</RequirementItem></Requirements>
  // → a bullet list, each item prefixed with its label.
  Requirements: (node) => {
    const items = (node.children ?? []).filter(
      (c) => c.type === 'mdxJsxFlowElement' && c.name === 'RequirementItem',
    )
    if (items.length === 0) return undefined // unwrap if shape is unexpected
    return {
      type: 'list',
      ...({ ordered: false, spread: false } as object),
      children: items.map((item) => {
        const label = getAttr(item, 'label')
        const body = [...(item.children ?? [])]
        if (label) body.unshift(paragraph([strong(label)]))
        return { type: 'listItem', ...({ spread: false } as object), children: body }
      }),
    }
  },

  // <Link href="…">text</Link> → a markdown link.
  Link: (node) => {
    const url = getAttr(node, 'href') ?? getAttr(node, 'to')
    if (!url) return undefined
    return { type: 'link', ...({ url } as object), children: node.children ?? [] }
  },
}
