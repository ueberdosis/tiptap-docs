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

const GLOBAL_SIDEBAR = 'src/content/sidebar.ts'
const OWN_SIDEBAR = 'src/content/ui-components/sidebar.ts'
const OUTSIDE_SIDEBAR_FILE = path.join(routes.ROOT, 'tests/fixtures/pages-outside-sidebar.txt')

function sidebarPages(config) {
  return routes
    .sidebarLinks(config)
    .map((link) => ({ ...link, route: routes.normalize(link.href) }))
    .filter((link) => pages.has(link.route))
}

test('the global sidebar holds every page of the section sidebars', () => {
  const sidebars = routes.loadSidebars()
  const global = new Set(
    sidebarPages(sidebars.find(({ file }) => file === GLOBAL_SIDEBAR).config).map(
      (link) => link.route,
    ),
  )
  const missing = sidebars
    .filter(({ file }) => file !== GLOBAL_SIDEBAR && file !== OWN_SIDEBAR)
    .flatMap(({ file, config }) =>
      sidebarPages(config)
        .filter((link) => !global.has(link.route))
        .map((link) => `${file}: ${link.trail.join(' › ')} → ${link.href}`),
    )
  assert.deepEqual(missing, [], `Place these in ${GLOBAL_SIDEBAR}`)
})

test('every page sits once in its sidebar', () => {
  const failures = []
  for (const file of [GLOBAL_SIDEBAR, OWN_SIDEBAR]) {
    const { config } = routes.loadSidebars().find((sidebar) => sidebar.file === file)
    const seen = new Map()
    for (const link of sidebarPages(config)) {
      // Links to different sections of one page are different entries
      const key = `${link.route}${link.href.includes('#') ? link.href.slice(link.href.indexOf('#')) : ''}`
      seen.set(key, [...(seen.get(key) ?? []), link.trail])
    }
    for (const [route, trails] of seen) {
      // A parent may link to the page of its first child
      const [first, ...rest] = trails
      const nested = rest.every((trail) => first.every((title, i) => trail[i] === title))
      if (trails.length > 1 && !nested) {
        failures.push(
          `${file}: ${route} in ${trails.map((trail) => trail.join(' › ')).join(' and ')}`,
        )
      }
    }
  }
  assert.deepEqual(failures, [])
})

test('pages outside every sidebar are exactly the listed ones', () => {
  const listed = fs
    .readFileSync(OUTSIDE_SIDEBAR_FILE, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
  const inSidebar = new Set(
    routes
      .loadSidebars()
      .filter(({ file }) => file === GLOBAL_SIDEBAR || file === OWN_SIDEBAR)
      .flatMap(({ config }) => sidebarPages(config).map((link) => link.route)),
  )
  const outside = [...pages].filter((route) => !inSidebar.has(route))
  assert.deepEqual(
    {
      unlisted: outside.filter((route) => !listed.includes(route)),
      stale: listed.filter((route) => !outside.includes(route)),
    },
    { unlisted: [], stale: [] },
    'Link new pages from a sidebar, or list them in tests/fixtures/pages-outside-sidebar.txt',
  )
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

test('every extension page is in the catalog, except the examples', () => {
  routes.registerTs()
  const { readFrontmatterSync } = require('../src/server/readFrontmatter.ts')
  const { CATALOG_GROUPS } = require('../src/content/catalog.ts')
  const groups = new Set(CATALOG_GROUPS.map((group) => group.id))
  const failures = []
  for (const file of routes.walk(routes.CONTENT_DIR)) {
    const route = routes.fileToRoute(file)
    const { extension } = readFrontmatterSync(file)
    if (!extension || route.startsWith('/examples/')) continue
    if (!extension.group) failures.push(`${route}: extension without a group`)
    else if (!groups.has(extension.group))
      failures.push(`${route}: unknown group "${extension.group}"`)
  }
  assert.deepEqual(failures, [], 'Add a group from src/content/catalog.ts to the extension block')
})
