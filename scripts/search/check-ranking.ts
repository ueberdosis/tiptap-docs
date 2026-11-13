import * as fs from 'fs'
import * as path from 'path'
import { searchParameters } from '../../src/utils/searchParameters'
import { collection, toPath, typesense } from './typesense'

/**
 * Runs the queries of `search/ranking-tests.json` with the site's search
 * parameters and reports where each expected page ranks.
 *
 *   TYPESENSE_SEARCH_API_KEY=… TYPESENSE_HOST=… pnpm search:check
 *
 * A search-only key is enough. To try other weights or sorting, set
 * NEXT_PUBLIC_SEARCH_WEIGHTS or NEXT_PUBLIC_SEARCH_SORT_BY for the run, as the
 * site reads them too. Exits with 1 when a query misses, so CI can run it.
 */

type Test = { query: string; expect: string[]; why: string }
// A search that fails inside multi_search comes back as an error, not a status
type Grouped = { grouped_hits?: { hits: { document: { url: string } }[] }[]; error?: string }

const FILE = path.join(process.cwd(), 'search/ranking-tests.json')
const apiKey = process.env.TYPESENSE_SEARCH_API_KEY || process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY

/** The test set, checked, so only query strings go to the server. */
function readTests(): { within: number; tests: Test[] } {
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'))
  const isText = (value: unknown) => typeof value === 'string' && value.trim() !== ''
  const valid =
    Number.isInteger(data?.within) &&
    Array.isArray(data?.tests) &&
    data.tests.every(
      (test: Test) =>
        isText(test?.query) &&
        test.query.length <= 100 &&
        Array.isArray(test.expect) &&
        test.expect.every(isText),
    )
  if (!valid) throw new Error(`${FILE} is not a valid test set.`)
  return data
}

async function main() {
  const { within, tests } = readTests()
  const { results } = await typesense<{ results: Grouped[] }>(apiKey, 'POST', '/multi_search', {
    searches: tests.map((test) => ({
      collection,
      q: String(test.query),
      ...searchParameters,
      per_page: 10,
    })),
  })

  let misses = 0
  tests.forEach((test, i) => {
    if (results[i].error) throw new Error(`"${test.query}": ${results[i].error}`)
    const pages = (results[i].grouped_hits ?? []).map((group) => toPath(group.hits[0].document.url))
    const rank = pages.findIndex((page) => test.expect.includes(page)) + 1
    const hit = rank > 0 && rank <= within
    if (!hit) misses++
    console.log(`${hit ? '✓' : '✗'} ${test.query.padEnd(24)} ${rank ? `#${rank}` : '–'}`)
    if (!hit) {
      console.log(`    expected ${test.expect.join(' or ')} (${test.why})`)
      console.log(`    got      ${pages.slice(0, within).join(', ') || 'nothing'}`)
    }
  })

  console.log(`\n${tests.length - misses} of ${tests.length} in the top ${within}`)
  console.log(`weights ${searchParameters.query_by_weights}, sort ${searchParameters.sort_by}`)
  if (misses) process.exit(1)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
