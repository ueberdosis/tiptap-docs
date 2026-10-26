import * as fs from 'fs'
import * as path from 'path'
import { collection, typesense } from './typesense'

/**
 * Upserts `search/synonyms.json` into the docs search.
 *
 *   TYPESENSE_ADMIN_API_KEY=… TYPESENSE_HOST=… pnpm search:synonyms
 *   pnpm search:synonyms --dry-run
 *
 * Needs a key that may write synonyms. The scraper copies synonyms to each new
 * collection it builds, so one run lasts until the file changes.
 *
 * Typesense 30 and later keep synonyms in synonym sets: the script writes the set
 * `tiptap-docs` and links it to the collection. Older servers keep them on the
 * collection; there, `--prune` also removes synonyms the file no longer has.
 */

type Synonym = { id: string; root?: string; synonyms: string[] }

const SYNONYM_SET = 'tiptap-docs'
const FILE = path.join(process.cwd(), 'search/synonyms.json')

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const prune = args.includes('--prune')
const apiKey = process.env.TYPESENSE_ADMIN_API_KEY

async function main() {
  const synonyms: Synonym[] = JSON.parse(fs.readFileSync(FILE, 'utf8'))
  const oneWay = synonyms.filter((synonym) => synonym.root).length
  console.log(
    `${synonyms.length} synonyms (${oneWay} one-way, ${synonyms.length - oneWay} multi-way)`,
  )
  if (dryRun) {
    console.log(`Dry run: would write them to "${collection}".`)
    return
  }

  const { version } = await typesense<{ version: string }>(apiKey, 'GET', '/debug')
  // The alias points to the collection the scraper built last
  const target = await typesense<{ collection_name: string }>(
    apiKey,
    'GET',
    `/aliases/${collection}`,
  )
    .then((alias) => alias.collection_name)
    .catch(() => collection)
  console.log(`Typesense ${version}, collection ${target}`)

  if (parseInt(version) >= 30) {
    await typesense(apiKey, 'PUT', `/synonym_sets/${SYNONYM_SET}`, { items: synonyms })
    const schema = await typesense<{ synonym_sets?: string[] }>(
      apiKey,
      'GET',
      `/collections/${target}`,
    )
    const sets = schema.synonym_sets ?? []
    if (!sets.includes(SYNONYM_SET)) {
      await typesense(apiKey, 'PATCH', `/collections/${target}`, {
        synonym_sets: [...sets, SYNONYM_SET],
      })
    }
    console.log(`Wrote the synonym set "${SYNONYM_SET}" and linked it to ${target}.`)
    return
  }

  for (const { id, ...rest } of synonyms) {
    await typesense(
      apiKey,
      'PUT',
      `/collections/${target}/synonyms/${encodeURIComponent(id)}`,
      rest,
    )
  }
  console.log(`Upserted ${synonyms.length} synonyms.`)

  const { synonyms: existing } = await typesense<{ synonyms: Synonym[] }>(
    apiKey,
    'GET',
    `/collections/${target}/synonyms`,
  )
  const ids = new Set(synonyms.map((synonym) => synonym.id))
  const stale = existing.filter((synonym) => !ids.has(synonym.id))
  if (!stale.length) return
  if (!prune) {
    console.log(`Not in the file: ${stale.map((s) => s.id).join(', ')} (remove with --prune)`)
    return
  }
  for (const { id } of stale) {
    await typesense(apiKey, 'DELETE', `/collections/${target}/synonyms/${encodeURIComponent(id)}`)
  }
  console.log(`Removed ${stale.length} synonyms the file no longer has.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
