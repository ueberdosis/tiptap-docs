import { findBundle } from '@/content/bundles'
import { CatalogEntry, getCatalog } from '@/server/getCatalog'

/** Paid parts come with the bundle's plan; open source ones are free either way. */
export type PartLicense = 'paid' | 'open-source'

const licenseOf = (entry: CatalogEntry): PartLicense =>
  entry.plan === 'Open source' ? 'open-source' : 'paid'

/** A bundle's parts as catalog entries; fails the build when one is missing from the catalog. */
export function bundleParts(id: string, license?: PartLicense): CatalogEntry[] {
  const bundle = findBundle(id)
  if (!bundle) throw new Error(`No bundle "${id}" in src/content/bundles.ts`)
  const catalog = getCatalog()
  return bundle.parts
    .map((name) => {
      const entry = catalog.find((candidate) => candidate.name === name)
      if (!entry) throw new Error(`Bundle "${id}" names "${name}", which the catalog lacks`)
      return entry
    })
    .filter((entry) => !license || licenseOf(entry) === license)
}

/** The parts as a Markdown table, for the .md pages agents read. */
export function bundlePartsMarkdown(
  id: string,
  license: PartLicense | undefined,
  link: (url: string) => string, // eslint-disable-line no-unused-vars
): string {
  const rows = bundleParts(id, license).map((entry) =>
    [
      entry.url ? `[${entry.name}](${link(entry.url)})` : entry.name,
      entry.description,
      entry.status ?? 'Stable',
    ].join(' | '),
  )
  return [
    '| Feature | What it adds | Status |',
    '| --- | --- | --- |',
    ...rows.map((row) => `| ${row} |`),
  ].join('\n')
}
