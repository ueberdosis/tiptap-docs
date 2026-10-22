import fs from 'fs'
import path from 'path'
import { sidebarConfig as globalSidebar } from '../content/sidebar'
import { sidebarConfig as uiComponentsSidebar } from '../content/ui-components/sidebar'
import type { CatalogPlan } from '../content/catalog'
import type { SidebarConfig, SidebarGroup, SidebarLink } from '../types'
import { planFromTags, statusFromTags } from './getCatalog'
import { readFrontmatterSync } from './readFrontmatter'

// Every page of the docs in navigation order, with where it sits and what it
// costs. llms.txt, the frontmatter of the `.md` pages and the MCP server read
// from here, so agents see the same structure as people.

export type DocsPage = {
  /** Route without base path, such as `/comments/getting-started/install`. */
  route: string
  title: string
  description?: string
  /** The sidebar entries above the page, such as `['Features', 'Review', 'Comments']`. */
  trail: string[]
  /** A paid plan from the page tags, or `Open source` for free features. Unset for other pages. */
  plan?: CatalogPlan
  /** Release state from the page tags, such as Beta or Deprecated. */
  status?: string
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content')
const CHANGELOG_PREFIX = '/resources/changelog/'

type Item = SidebarLink | SidebarGroup | Omit<SidebarLink, 'type'>

/** The MDX file of a route, if it has one. */
export function fileForRoute(route: string): string | undefined {
  const rel = route === '/' ? 'index' : route.slice(1)
  for (const candidate of [`${rel}.mdx`, `${rel}/index.mdx`]) {
    const file = path.join(CONTENT_DIR, candidate)
    if (fs.existsSync(file)) return file
  }
  return undefined
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^<>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// A closing sentence that only points back to the docs, such as "Learn more in our docs!"
const DOCS_FILLER =
  /\s*(?:Learn more|Read more|Find out more|More|Learn how to set (?:it )?up(?: and use it)? here|Follow our detailed guide|Source code and usage examples)(?: here)? in (?:the|our) docs[.!]?$/i

/** A description for agents: plain text, without SEO filler. */
export function cleanDescription(value: string): string {
  return stripHtml(value).replace(DOCS_FILLER, '').trim()
}

function planOf(tags: string[], isFeature: boolean): CatalogPlan | undefined {
  const plan = planFromTags(tags)
  return plan !== 'Open source' || isFeature ? plan : undefined
}

function pageFromFile(route: string, file: string, trail: string[], fallbackTitle?: string) {
  const attributes = readFrontmatterSync(file)
  const tags = (attributes.tags ?? []).map((tag) => tag.type)
  const description = attributes.meta?.description ?? attributes.description
  return {
    route,
    title: attributes.title ?? attributes.meta?.title ?? fallbackTitle ?? route,
    description: description ? cleanDescription(description) : undefined,
    trail,
    plan: planOf(tags, !!attributes.extension),
    status: statusFromTags(tags),
  }
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.endsWith('.mdx')) out.push(full)
  }
  return out
}

function fileToRoute(file: string): string {
  const rel = path
    .relative(CONTENT_DIR, file)
    .split(path.sep)
    .join('/')
    .replace(/\.mdx$/, '')
    .replace(/(^|\/)index$/, '')
  return `/${rel}`
}

let index: DocsPage[] | undefined

/** Every page once, in sidebar order; pages no sidebar links to come last. */
export function getDocsIndex(): DocsPage[] {
  if (index) return index

  const pages: DocsPage[] = []
  const seen = new Set<string>()

  const visit = (items: Item[], trail: string[]) => {
    for (const item of items) {
      const route = item.href?.split('#')[0]
      const isPage = !('type' in item && item.type === 'group') && route && !item.external
      if (isPage && !seen.has(route)) {
        const file = fileForRoute(route)
        if (file) {
          seen.add(route)
          pages.push(pageFromFile(route, file, trail, item.title))
        } else if (route.startsWith(CHANGELOG_PREFIX)) {
          // Changelog pages come from data, not MDX, and have no frontmatter
          seen.add(route)
          pages.push({ route, title: item.title, trail })
        }
      }
      // A section sidebar may repeat the title it sits under, such as UI Components
      const next = trail.at(-1) === item.title ? trail : [...trail, item.title]
      if (item.children) visit(item.children, next)
    }
  }

  const sidebars: [SidebarConfig, string[]][] = [
    [globalSidebar, []],
    [uiComponentsSidebar, ['UI Components']],
  ]
  for (const [config, trail] of sidebars) visit(config.items, trail)

  for (const file of walk(CONTENT_DIR)) {
    const route = fileToRoute(file)
    // Segments starting with `_` are partials that other pages import
    if (seen.has(route) || route.split('/').some((segment) => segment.startsWith('_'))) continue
    seen.add(route)
    pages.push(pageFromFile(route, file, []))
  }

  index = pages
  return index
}

/** The index entry for a route, if the route is a page. */
export function findDocsPage(route: string): DocsPage | undefined {
  return getDocsIndex().find((page) => page.route === route)
}
