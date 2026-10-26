import { findBundle } from '@/content/bundles'
import { PLAN_LABELS } from '@/content/catalog'
import { CatalogEntry, getCatalog } from '@/server/getCatalog'

/** A bundle's parts as catalog entries; fails the build when one is missing from the catalog. */
export function bundleParts(id: string): CatalogEntry[] {
  const bundle = findBundle(id)
  if (!bundle) throw new Error(`No bundle "${id}" in src/content/bundles.ts`)
  const catalog = getCatalog()
  return bundle.parts.map((name) => {
    const entry = catalog.find((candidate) => candidate.name === name)
    if (!entry) throw new Error(`Bundle "${id}" names "${name}", which the catalog lacks`)
    return entry
  })
}

/** How a part's plan reads on its own, outside the bundle. */
export const partPlan = (entry: CatalogEntry) =>
  entry.plan ? PLAN_LABELS[entry.plan].label : entry.paid ? 'Paid' : ''

/** The parts as a Markdown table, for the .md pages agents read. */
export function bundlePartsMarkdown(
  id: string,
  link: (url: string) => string, // eslint-disable-line no-unused-vars
): string {
  const rows = bundleParts(id).map((entry) =>
    [
      entry.url ? `[${entry.name}](${link(entry.url)})` : entry.name,
      entry.description,
      entry.status ?? 'Stable',
      partPlan(entry),
    ].join(' | '),
  )
  return [
    '| Feature | What it adds | Status | On its own |',
    '| --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row} |`),
  ].join('\n')
}
