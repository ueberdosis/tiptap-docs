import fs from 'fs'
import path from 'path'
import { sidebarConfig as globalSidebar } from '../content/sidebar'
import { sidebarConfig as uiComponentsSidebar } from '../content/ui-components/sidebar'
import { CATALOG_PLANS, type CatalogPlan } from '../content/catalog'
import type { SidebarConfig, SidebarGroup, SidebarLink } from '../types'
import { planFromTags, statusFromTags } from './getCatalog'
import { readFrontmatterSync } from './readFrontmatter'
import { stripTags } from '@/utils/stripTags'

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
  /**
   * A paid plan, or `Open source` for free features. Comes from the page tags, or else
   * from the nearest sidebar entry above it, so a feature's subpages share its plan.
   */
  plan?: CatalogPlan
  /** Release state, such as Beta or Legacy, from the page tags or inherited like `plan`. */
  status?: string
  /** The npm packages of a feature page, space-separated. */
  package?: string
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content')
const CHANGELOG_PREFIX = '/resources/changelog/'

type Item = SidebarLink | SidebarGroup | Omit<SidebarLink, 'type'>

/** What a page inherits from the sidebar entries above it. */
type Inherited = Pick<DocsPage, 'plan' | 'status'>

// "New" and "Soon" describe one entry, not the pages under it
const INHERITED_STATUSES = ['Legacy', 'Alpha', 'Beta']

/** The plan and status a sidebar entry's labels pass on, over what it inherited itself. */
function inheritFrom(tags: string[] | undefined, inherited: Inherited): Inherited {
  if (!tags?.length) return inherited
  const plan = CATALOG_PLANS.find((candidate) => tags.includes(candidate))
  const status = INHERITED_STATUSES.find((candidate) => tags.includes(candidate))
  return { plan: plan ?? inherited.plan, status: status ?? inherited.status }
}

function withInherited(page: DocsPage, inherited: Inherited): DocsPage {
  return { ...page, plan: page.plan ?? inherited.plan, status: page.status ?? inherited.status }
}

/** The number of leading route segments two routes share. */
function sharedSegments(a: string, b: string): number {
  const left = a.split('/').filter(Boolean)
  const right = b.split('/').filter(Boolean)
  let count = 0
  while (count < left.length && left[count] === right[count]) count++
  return count
}

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
  return stripTags(value).replace(/\s+/g, ' ').trim()
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
    package: attributes.extension?.package,
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

  const visit = (items: Item[], trail: string[], inherited: Inherited) => {
    for (const item of items) {
      const route = item.href?.split('#')[0]
      const isPage = !('type' in item && item.type === 'group') && route && !item.external
      const own = inheritFrom(item.tags, inherited)
      if (isPage && !seen.has(route)) {
        const file = fileForRoute(route)
        if (file) {
          seen.add(route)
          pages.push(withInherited(pageFromFile(route, file, trail, item.title), own))
        } else if (route.startsWith(CHANGELOG_PREFIX)) {
          // Changelog pages come from data, not MDX, and have no frontmatter
          seen.add(route)
          pages.push({ route, title: item.title, trail })
        }
      }
      // A section sidebar may repeat the title it sits under, such as UI Components
      const next = trail.at(-1) === item.title ? trail : [...trail, item.title]
      if (item.children) visit(item.children, next, own)
    }
  }

  const sidebars: [SidebarConfig, string[]][] = [
    [globalSidebar, []],
    [uiComponentsSidebar, ['UI Components']],
  ]
  for (const [config, trail] of sidebars) visit(config.items, trail, {})

  const inSidebar = [...pages]
  for (const file of walk(CONTENT_DIR)) {
    const route = fileToRoute(file)
    // Segments starting with `_` are partials that other pages import
    if (seen.has(route) || route.split('/').some((segment) => segment.startsWith('_'))) continue
    seen.add(route)
    // A page outside the sidebar inherits from the sidebar page whose route it shares most of
    const nearest = inSidebar.reduce<DocsPage | undefined>((best, candidate) => {
      const shared = sharedSegments(route, candidate.route)
      return shared >= 2 && shared > (best ? sharedSegments(route, best.route) : 0)
        ? candidate
        : best
    }, undefined)
    const inherited = nearest ? { plan: nearest.plan, status: nearest.status } : {}
    pages.push(withInherited(pageFromFile(route, file, []), inherited))
  }

  index = pages
  return index
}

/** The index entry for a route, if the route is a page. */
export function findDocsPage(route: string): DocsPage | undefined {
  return getDocsIndex().find((page) => page.route === route)
}
