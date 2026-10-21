// Structure checks that need no server: every published URL still reaches a
// page, redirects end on pages, and sidebars and links point at real pages.
// Run with `pnpm test:structure`.

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

const routes = require('./helpers/routes.cjs')

const pages = new Set(routes.listPageRoutes())
const resolve = routes.createResolver(pages)
const PUBLIC_DIR = path.join(routes.ROOT, 'public')

/** A redirect may also end on a static file in public/ or on another site. */
function reachesTarget(result) {
  if (result.status === 'page' || result.status === 'external') return true
  return result.status === 'missing' && fs.existsSync(path.join(PUBLIC_DIR, result.final))
}

function describe(result) {
  const hops = result.hops.map((hop) => `${hop.from} → ${hop.to} (${hop.source})`).join(', ')
  return `${result.status}${hops ? ` via ${hops}` : ''}`
}

test('every known URL still reaches a page in at most one redirect', () => {
  const failures = []
  for (const url of routes.readKnownUrls()) {
    const result = resolve(url)
    if (!reachesTarget(result)) failures.push(`${url}: ${describe(result)}`)
    else if (result.hops.length > 1) failures.push(`${url}: redirect chain, ${describe(result)}`)
  }
  assert.deepEqual(failures, [], 'Add or fix a redirect in src/server/redirects.mjs')
})

test('every page is listed in known-urls.txt', () => {
  const known = new Set(routes.readKnownUrls())
  const missing = [...pages].filter((route) => !known.has(route))
  assert.deepEqual(missing, [], 'Run `pnpm urls:update` and commit tests/fixtures/known-urls.txt')
})

test('no redirect hides an existing page', () => {
  // Next.js applies redirects before it renders pages.
  const hidden = routes.redirects
    .filter(({ source }) => pages.has(routes.normalize(source)))
    .map(({ source }) => source)
  assert.deepEqual(hidden, [])
})

test('every exact redirect points straight at a page', () => {
  const failures = []
  for (const { source, destination } of routes.redirects) {
    if (source.includes(':') || /^https?:\/\//.test(destination)) continue
    const result = resolve(destination)
    if (!reachesTarget(result)) failures.push(`${source} → ${destination}: ${describe(result)}`)
    else if (result.hops.length > 0)
      failures.push(`${source} → ${destination}: chain, ${describe(result)}`)
  }
  assert.deepEqual(failures, [])
})

test('.md requests follow the same redirects as pages', () => {
  // src/server/markdown matches exact sources first, then `/:rest*` sources;
  // Next.js uses array order. Both have to agree on every known URL.
  routes.registerTs()
  const { resolveContentPath } = require('../src/server/markdown/resolveContentPath.ts')
  const disagreements = []
  for (const url of routes.readKnownUrls()) {
    if (pages.has(url) || routes.isAppRoute(url)) continue
    const next = routes.matchRedirect(url)
    const markdown = resolveContentPath(url)
    const nextDestination = next ? next.destination : null
    const markdownDestination =
      markdown.type === 'redirect' ? markdown.destination.replace(/\/+(?=#|$)/, '') : null
    if (nextDestination !== markdownDestination) {
      disagreements.push(`${url}: page → ${nextDestination}, .md → ${markdownDestination}`)
    }
  }
  assert.deepEqual(disagreements, [])
})

test('every sidebar link reaches a page', () => {
  const failures = []
  for (const { file, config } of routes.loadSidebars()) {
    for (const link of routes.sidebarLinks(config)) {
      const result = resolve(link.href)
      if (result.status !== 'page')
        failures.push(`${file}: ${link.trail.join(' › ')} → ${link.href}: ${describe(result)}`)
    }
  }
  assert.deepEqual(failures, [])
})

test('every internal link in content and components reaches a page', () => {
  const sources = [
    ...routes.walk(routes.CONTENT_DIR),
    ...routes.walk(path.join(routes.ROOT, 'src/components'), ['.tsx', '.ts']),
    ...routes.walk(path.join(routes.ROOT, 'src/app'), ['.tsx', '.ts']),
  ]
  const failures = []
  for (const file of sources) {
    for (const link of routes.extractLinks(fs.readFileSync(file, 'utf8'))) {
      const result = resolve(link.href)
      if (!reachesTarget(result)) {
        failures.push(
          `${path.relative(routes.ROOT, file)}:${link.line} ${link.href}: ${describe(result)}`,
        )
      }
    }
  }
  assert.deepEqual(failures, [])
})
