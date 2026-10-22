import fs from 'fs'
import path from 'path'
import { CATALOG_GROUPS, CatalogArea, CatalogPlan } from '../content/catalog'
import type { ExtensionType } from '../types'
import { readFrontmatterSync } from './readFrontmatter'

export type CatalogEntry = {
  name: string
  description: string
  icon: string | null
  type: ExtensionType
  group: string
  area: CatalogArea
  plan: CatalogPlan
  /** Release state from the page tags, such as Beta or Alpha. */
  status?: string
  url: string
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

function planFromTags(tags: string[]): CatalogPlan {
  if (tags.includes('restricted')) return 'Pilot program'
  if (tags.includes('addon')) return 'Add-on'
  if (tags.includes('team')) return 'Team'
  if (tags.includes('start') || tags.includes('beginStart')) return 'Start'
  return 'Open source'
}

function statusFromTags(tags: string[]): string | undefined {
  if (tags.includes('deprecated')) return 'Deprecated'
  if (tags.includes('alpha')) return 'Alpha'
  if (tags.includes('beta')) return 'Beta'
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
  catalog ??= readCatalog(CONTENT_DIR)
  return catalog
}

/** Reads the catalog from the headers of the MDX files in `contentDir`. */
export function readCatalog(contentDir: string): CatalogEntry[] {
  const groups = new Map(CATALOG_GROUPS.map((group, index) => [group.id, { ...group, index }]))
  const entries: { order: number; entry: CatalogEntry }[] = []

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
      order: group.index,
      entry: {
        name: extension.name,
        description: extension.description,
        icon: extension.icon,
        type: extension.type,
        group: group.id,
        area: group.area,
        plan: planFromTags(tags),
        status: statusFromTags(tags),
        url: `/${route}`,
      },
    })
  }

  entries.sort((a, b) => a.order - b.order || a.entry.name.localeCompare(b.entry.name))
  return entries.map(({ entry }) => entry)
}
