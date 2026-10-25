import { unified } from 'unified'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { changelogMarkdown, formatDay } from '../changelogEntries'
import { groupFeeds } from '../changelogFeed'
import { getCatalog } from '../getCatalog'
import { getPlanRows } from '../planOverview'
import { ADD_ON_ACCESS, DASHBOARD_URL, PILOT_PROGRAM_FORM } from '@/content/access'
import { CHANGELOG_HIGHLIGHTS } from '@/content/resources/changelog-highlights'
import { CATALOG_GROUPS, catalogGroupUrl } from '@/content/catalog'
import { DEMO_URL, PRO_DEMO_URL } from '@/utils/constants'

/** Open-source demos live in the tiptap repository; Pro demos stay private. */
const OPEN_SOURCE_DEMOS = 'https://github.com/ueberdosis/tiptap/tree/main/demos/src'

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
  // A JSX caption such as `<><strong>Try it</strong> …</>` keeps only its text
  const plain = explicit
    ?.replace(/<[^<>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (plain) return plain
  const last = url.split('?')[0].split('/').filter(Boolean).pop()
  return last ? last.replace(/[-_]/g, ' ') : 'Open demo'
}

export const componentConverters: Record<string, ComponentConverter> = {
  // <CodeDemo path="/Examples/Minimal" /> → blockquote linking to the live demo and,
  // for open-source demos, to their code on GitHub, which an agent can read.
  CodeDemo: (node) => {
    const src = getAttr(node, 'src')
    const path = getAttr(node, 'path') ?? ''
    const isPro = hasFlag(node, 'isPro')
    const url = src ?? (isPro ? PRO_DEMO_URL : DEMO_URL) + path
    const children = [
      paragraph([strong('Interactive demo:'), text(' '), link(url, demoLabel(node, url))]),
    ]
    const folder = path.split('?')[0].replace(/\/+$/, '')
    if (!src && !isPro && folder) {
      children.push(
        paragraph([
          strong('Source code:'),
          text(' '),
          link(`${OPEN_SOURCE_DEMOS}${folder}`, `demos/src${folder}`),
        ]),
      )
    }
    return { type: 'blockquote', children }
  },

  // <DemoViewer path="…" /> is the same demo in a different frame.
  DemoViewer: (node) => componentConverters.CodeDemo(node),

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

  // <PlanOverview /> → what each plan includes, as a list, from the catalog.
  PlanOverview: () => ({
    type: 'list',
    ...({ ordered: false, spread: false } as object),
    children: getPlanRows().map((row) => {
      const items = [
        ...row.features.map(({ name, url }) => ({ label: name, url })),
        ...(row.links ?? []),
      ]
      const line: MdxNode[] = [strong(`${row.title}:`), text(` ${row.text}`)]
      if (row.catalog) line.push(text(' '), link(row.catalog.url, `${row.catalog.count} features`))
      items.forEach((item, i) => {
        line.push(text(i === 0 ? ' ' : ', '), link(item.url, item.label))
      })
      return { type: 'listItem', ...({ spread: false } as object), children: [paragraph(line)] }
    }),
  }),

  // <CatalogGroup id="…" /> → the group's features as a list, with plan and status.
  CatalogGroup: (node) => catalogList(getAttr(node, 'id')),

  // <FeatureCatalog /> → every group with a heading and its features, as on the page.
  FeatureCatalog: () =>
    CATALOG_GROUPS.filter((group) =>
      getCatalog().some((entry) => entry.group === group.id),
    ).flatMap((group) => {
      const url = catalogGroupUrl(group)
      const heading: MdxNode = {
        type: 'heading',
        ...({ depth: 2 } as object),
        children: [url ? link(url, group.title) : text(group.title)],
      }
      return [heading, catalogList(group.id)]
    }),

  // <Link href="…">text</Link> → a markdown link.
  Link: (node) => {
    const url = getAttr(node, 'href') ?? getAttr(node, 'to')
    if (!url) return undefined
    return { type: 'link', ...({ url } as object), children: node.children ?? [] }
  },

  // <a href="…">text</a> in MDX → a markdown link, like Link.
  a: (node) => componentConverters.Link(node),

  // <AddOnAccessTable /> → how to try and get each add-on and pilot feature
  AddOnAccessTable: () => {
    const catalog = getCatalog()
    const lines = catalog
      .filter((entry) => entry.plan === 'Add-on' && entry.url)
      .map((entry) => {
        const access = ADD_ON_ACCESS[entry.name]
        const how = access?.dashboard
          ? `[buy it in the dashboard](${DASHBOARD_URL})`
          : `[contact the Tiptap team](${access?.contact ?? 'https://tiptap.dev/contact-sales'})`
        return `- [${entry.name}](${entry.url}) (add-on): ${access?.trial === undefined ? 'ask the team about the trial' : access.trial ? 'in the trial' : 'not in the trial'}; ${how}`
      })
    const pilot = catalog
      .filter((entry) => entry.plan === 'Pilot program' && entry.url)
      .map((entry) => `[${entry.name}](${entry.url})`)
      .join(', ')
    lines.push(`- ${pilot} (pilot program): [join the pilot program](${PILOT_PROGRAM_FORM})`)
    return markdownNodes(lines.join('\n'))
  },

  // The changelog page's generated sections
  ChangelogHighlights: () =>
    markdownNodes(
      CHANGELOG_HIGHLIGHTS.map(
        (highlight) =>
          `- **${highlight.type}** · [${highlight.title}](${highlight.url}) (${highlight.feature} ${highlight.version}, ${formatDay(highlight.date)}): ${highlight.text}`,
      ).join('\n'),
    ),
  ChangelogReleases: () => markdownNodes(changelogMarkdown.releases()),
  ChangelogPackages: () => markdownNodes(changelogMarkdown.packages()),
  ChangelogFeeds: () =>
    markdownNodes(
      [{ title: 'All releases', href: '/resources/changelog/rss.xml' }, ...groupFeeds()]
        .map((feed) => `- [${feed.title}](${feed.href})`)
        .join('\n'),
    ),
}

/** Markdown text as nodes, so generated sections go through the same transform. */
function markdownNodes(markdown: string): MdxNode[] {
  return unified().use(remarkParse).use(remarkGfm).parse(markdown).children as MdxNode[]
}

/** The features of a catalog group as a list, with plan and status. */
function catalogList(id: string | undefined): MdxNode {
  return {
    type: 'list',
    ...({ ordered: false, spread: false } as object),
    children: getCatalog()
      .filter((entry) => entry.group === id)
      .map((entry) => {
        const notes = [entry.status, entry.plan].filter(Boolean).join(', ')
        const line: MdxNode[] = [
          entry.url ? link(entry.url, entry.name) : strong(entry.name),
          text(`${notes ? ` (${notes})` : ''}: ${entry.description}`),
        ]
        return { type: 'listItem', ...({ spread: false } as object), children: [paragraph(line)] }
      }),
  }
}

/**
 * A self-closing card with `href` and `title`, such as a card component a page
 * defines for itself, as a list item: `[title](href): description`.
 */
export function cardItem(node: MdxNode): MdxNode | undefined {
  if (node.children?.length) return undefined
  const url = getAttr(node, 'href')
  const title = getAttr(node, 'title')
  if (!url || !title) return undefined
  const description = getAttr(node, 'description')
  const line = [link(url, title), ...(description ? [text(`: ${description}`)] : [])]
  return { type: 'listItem', ...({ spread: false } as object), children: [paragraph(line)] }
}
