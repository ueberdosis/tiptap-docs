import fs from 'fs'
import path from 'path'
import { CATALOG_GROUPS, CatalogArea, CatalogPlan } from '../content/catalog'
import { INDUSTRIES } from '../content/industries'
import type { ExtensionType } from '../types'
import { readFrontmatterSync } from './readFrontmatter'

export type CatalogEntry = {
  name: string
  description: string
  icon: string | null
  type: ExtensionType
  group: string
  area: CatalogArea
  plan?: CatalogPlan
  /** Release state from the page tags, such as Beta or Alpha. */
  status?: string
  url: string
  /** The npm packages to install, space-separated. */
  package?: string
  /** Industries from src/content/industries.ts where this feature matters most. */
  industries?: string[]
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

export function planFromTags(tags: string[]): CatalogPlan {
  if (tags.includes('restricted')) return 'Pilot program'
  if (tags.includes('addon')) return 'Add-on'
  if (tags.includes('team')) return 'Team'
  if (tags.includes('start') || tags.includes('beginStart')) return 'Start'
  return 'Open source'
}

export function statusFromTags(tags: string[]): string | undefined {
  if (tags.includes('legacy')) return 'Legacy'
  if (tags.includes('alpha')) return 'Alpha'
  if (tags.includes('beta')) return 'Beta'
  if (tags.includes('experiment')) return 'Experimental'
  if (tags.includes('new')) return 'New'
  return undefined
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.endsWith('.mdx') && !entry.name.startsWith('_')) out.push(full)
  }
  return out
}

let catalog: CatalogEntry[] | undefined

/** Every catalog entry, in group order and then by name. Read once per process. */
export function getCatalog(): CatalogEntry[] {
  catalog ??= sortByGroup(readCatalog(CONTENT_DIR)).map((entry) => {
    const industries = INDUSTRIES.filter((industry) => industry.features.includes(entry.name)).map(
      (industry) => industry.id,
    )
    return industries.length ? { ...entry, industries } : entry
  })
  return catalog
}

function sortByGroup(entries: CatalogEntry[]): CatalogEntry[] {
  const order = new Map(CATALOG_GROUPS.map(({ id }, index) => [id, index]))
  // A kit bundles its group's extensions and is what most people install, so it comes first
  const isKit = (entry: CatalogEntry) => Number(/ kit$/i.test(entry.name))
  return [...entries].sort(
    (a, b) =>
      order.get(a.group)! - order.get(b.group)! ||
      isKit(b) - isKit(a) ||
      a.name.localeCompare(b.name),
  )
}

/** Reads the catalog from the headers of the MDX files in `contentDir`. */
export function readCatalog(contentDir: string): CatalogEntry[] {
  const groups = new Map(CATALOG_GROUPS.map((group) => [group.id, group]))
  const entries: CatalogEntry[] = []

  for (const file of walk(contentDir)) {
    const attributes = readFrontmatterSync(file)
    const extension = attributes.extension
    if (!extension?.group) continue
    const group = groups.get(extension.group)
    if (!group) throw new Error(`Unknown catalog group "${extension.group}" in ${file}`)

    const tags = (attributes.tags ?? []).map((tag) => tag.type)
    const route = path
      .relative(contentDir, file)
      .split(path.sep)
      .join('/')
      .replace(/\.mdx$/, '')
      .replace(/(^|\/)index$/, '')

    entries.push({
      name: extension.name,
      description: extension.description,
      icon: extension.icon,
      type: extension.type,
      group: group.id,
      area: group.area,
      plan: planFromTags(tags),
      status: statusFromTags(tags),
      url: `/${route}`,
      ...(extension.package ? { package: extension.package } : {}),
    })
  }

  return sortByGroup(entries)
}
