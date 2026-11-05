// Adds every current page and every exact redirect source to
// tests/fixtures/known-urls.txt. Never removes a URL: once published, a URL has
// to keep working, either as a page or through a redirect in
// src/server/redirects.mjs. Run after adding pages: `pnpm urls:update`.

const fs = require('node:fs')
const path = require('node:path')
const {
  KNOWN_URLS_FILE,
  listPageRoutes,
  readKnownUrls,
  redirects,
} = require('../tests/helpers/routes.cjs')

const HEADER = `# Every docs URL that has been published. tests/structure.test.cjs checks that
# each one still reaches a page. Never delete a line; add a redirect instead.
# Update with \`pnpm urls:update\`.
`

const known = new Set(readKnownUrls())
const before = known.size

for (const route of listPageRoutes()) known.add(route)
for (const { source } of redirects) {
  if (!source.includes(':')) known.add(source)
}

fs.mkdirSync(path.dirname(KNOWN_URLS_FILE), { recursive: true })
fs.writeFileSync(KNOWN_URLS_FILE, `${HEADER}${[...known].sort().join('\n')}\n`)

console.log(`known-urls.txt: ${known.size} URLs (${known.size - before} added)`)
