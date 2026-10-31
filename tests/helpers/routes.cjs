// Routes, redirects and sidebars as the site resolves them, for the structure
// tests and the browser smoke tests. Paths never include BASE_PATH.

const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, '../..')
const CONTENT_DIR = path.join(ROOT, 'src/content')
const KNOWN_URLS_FILE = path.join(ROOT, 'tests/fixtures/known-urls.txt')

const { redirects } = require('../../src/server/redirects.mjs')

function walk(dir, extensions = ['.mdx'], out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, extensions, out)
    else if (extensions.some((ext) => entry.name.endsWith(ext))) out.push(full)
  }
  return out
}

/** `editor/extensions/nodes/index.mdx` → `/editor/extensions/nodes`. */
function fileToRoute(file) {
  const rel = path.relative(CONTENT_DIR, file).split(path.sep).join('/')
  const route = rel.replace(/\.mdx$/, '').replace(/(^|\/)index$/, '')
  return `/${route}`
}

/** A segment starting with `_` marks a partial that other pages import. */
function isPartial(route) {
  return route.split('/').some((segment) => segment.startsWith('_'))
}

/** Every page the site renders from MDX, sorted. */
function listPageRoutes() {
  return walk(CONTENT_DIR)
    .map(fileToRoute)
    .filter((route) => !isPartial(route))
    .sort()
}

// Changelog pages come from src/app/resources/changelog/[slug], with data that
// `pnpm generate:changelogs` fetches at build time.
const CHANGELOG_INDEX = path.join(CONTENT_DIR, 'resources/changelog/_data/index.json')
const CHANGELOG_PREFIX = '/resources/changelog/'

function isAppRoute(route) {
  if (!route.startsWith(CHANGELOG_PREFIX)) return false
  const slug = route.slice(CHANGELOG_PREFIX.length)
  // RSS feeds: rss.xml and one per feature group, rss/<group>.xml
  if (slug === 'rss.xml' || /^rss\/[a-z-]+\.xml$/.test(slug)) return true
  if (!slug || slug.includes('/')) return false
  // Without generated data, any slug counts; the build checks the real list.
  if (!fs.existsSync(CHANGELOG_INDEX)) return true
  const index = JSON.parse(fs.readFileSync(CHANGELOG_INDEX, 'utf8'))
  return index.some((entry) => entry.slug === slug)
}

/** Normalizes a link or URL path: no query, hash, trailing slash or `.md`. */
function normalize(url) {
  let p = url
    .split('?')[0]
    .split('#')[0]
    .replace(/\.mdx?$/i, '')
  p = p.replace(/\/+/g, '/')
  if (p.length > 1) p = p.replace(/\/$/, '')
  return p || '/'
}

/**
 * Compiles a Next.js redirect source (`:name`, `:name*`, `:name+`, `:name?`)
 * into a matcher that returns the named parameters or null.
 */
function compileSource(source) {
  const names = []
  let pattern = ''
  for (const segment of source.split('/').slice(1)) {
    const param = segment.match(/^:(\w+)([*+?]?)$/)
    if (!param) {
      pattern += `/${segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
      continue
    }
    const [, name, modifier] = param
    names.push(name)
    if (modifier === '*') pattern += '(?:/(.*))?'
    else if (modifier === '+') pattern += '/(.+)'
    else if (modifier === '?') pattern += '(?:/([^/]+))?'
    else pattern += '/([^/]+)'
  }
  const regex = new RegExp(`^${pattern || '/'}$`)
  return (pathname) => {
    const match = pathname.match(regex)
    if (!match) return null
    return Object.fromEntries(names.map((name, i) => [name, match[i + 1] ?? '']))
  }
}

const compiled = redirects.map((redirect) => ({
  ...redirect,
  match: compileSource(redirect.source),
}))

function applyDestination(destination, params) {
  return destination
    .replace(/:(\w+)[*+?]?/g, (token, name) => (name in params ? params[name] : token))
    .replace(/\/+(?=#|$)/, '')
}

/** The first redirect that matches, in array order, as Next.js applies them. */
function matchRedirect(pathname) {
  for (const redirect of compiled) {
    const params = redirect.match(pathname)
    if (params) return { redirect, destination: applyDestination(redirect.destination, params) }
  }
  return null
}

/**
 * Follows a URL through pages and redirects.
 * Returns `{ status: 'page' | 'missing' | 'loop' | 'external', hops: [...], final }`.
 */
function createResolver(pages = new Set(listPageRoutes())) {
  return function resolve(url) {
    const hops = []
    let current = normalize(url)
    for (let i = 0; i < 10; i++) {
      if (pages.has(current) || isAppRoute(current)) return { status: 'page', hops, final: current }
      const hit = matchRedirect(current)
      if (!hit) return { status: 'missing', hops, final: current }
      hops.push({ from: current, to: hit.destination, source: hit.redirect.source })
      if (/^https?:\/\//.test(hit.destination))
        return { status: 'external', hops, final: hit.destination }
      current = normalize(hit.destination)
    }
    return { status: 'loop', hops, final: current }
  }
}

function readKnownUrls() {
  if (!fs.existsSync(KNOWN_URLS_FILE)) return []
  return fs
    .readFileSync(KNOWN_URLS_FILE, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
}

let tsRegistered = false

/** Lets tests require the site's TypeScript, including `@/` imports. */
function registerTs() {
  if (tsRegistered) return
  tsRegistered = true
  require('ts-node').register({
    transpileOnly: true,
    compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
  })
  const Module = require('node:module')
  const resolveFilename = Module._resolveFilename
  Module._resolveFilename = function (request, ...rest) {
    const mapped = request.startsWith('@/') ? path.join(ROOT, 'src', request.slice(2)) : request
    return resolveFilename.call(this, mapped, ...rest)
  }
}

/** Loads every `sidebar.ts` under src/content as `{ file, config }`. */
function loadSidebars() {
  registerTs()
  const files = walkSidebars(CONTENT_DIR)
  return files.map((file) => ({
    file: path.relative(ROOT, file),
    config: require(file).sidebarConfig,
  }))
}

function walkSidebars(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkSidebars(full, out)
    else if (entry.name === 'sidebar.ts') out.push(full)
  }
  return out.sort()
}

/** Every link in a sidebar config, with its title path for error messages. */
function sidebarLinks(config) {
  const links = []
  const visit = (items, trail) => {
    for (const item of items) {
      const here = [...trail, item.title]
      // Group titles render as plain text; their href is only a key.
      const internal = item.href && !item.external && !/^https?:\/\//.test(item.href)
      if (item.type !== 'group' && internal) links.push({ href: item.href, trail: here })
      if (item.children) visit(item.children, here)
    }
  }
  visit(config.items, [])
  return links
}

const DOCS_ORIGIN = /^https:\/\/tiptap\.dev\/docs(?=\/|$)/
// Frontmatter HTML such as `intro` renders as is, so its links carry the production basePath
const BASE_PATH = /^\/docs(?=\/|$)/
const LINK_PATTERN = new RegExp(
  [
    // Markdown links: [text](/path)
    String.raw`\]\((/[^)\s]*|https://tiptap\.dev/docs[^)\s]*)\)`,
    // JSX and object props: href="/path", documentationUrl: '/path'
    String.raw`(?:href|[a-zA-Z]*Url|url|link)\s*[=:]\s*\{?\s*["'\x60](/[^"'\x60\s]*|https://tiptap\.dev/docs[^"'\x60\s]*)["'\x60]`,
  ].join('|'),
  'g',
)
const ASSET_FOLDER = /^\/(assets|images|api)\//
const ASSET_FILE = /\.(png|jpe?g|svg|gif|mp4|webm|webp|pdf|json|txt|xml)$/i

/** Internal links in a source file, with their line numbers. Skips assets. */
function extractLinks(source) {
  // Code samples hold example URLs; blank them but keep line numbers.
  const prose = source.replace(/^(\s*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\2\s*$/gm, (block) =>
    block.replace(/[^\n]/g, ''),
  )
  const frontmatterEnd = prose.startsWith('---\n') ? prose.indexOf('\n---', 3) : -1
  const links = []
  for (const match of prose.matchAll(LINK_PATTERN)) {
    const raw = match[1] ?? match[2]
    const local = raw.replace(DOCS_ORIGIN, '')
    const href = (match.index < frontmatterEnd ? local.replace(BASE_PATH, '') : local) || '/'
    const target = href.split(/[?#]/)[0]
    if (ASSET_FOLDER.test(target) || ASSET_FILE.test(target)) continue
    const line = prose.slice(0, match.index).split('\n').length
    links.push({ href, line })
  }
  return links
}

module.exports = {
  ROOT,
  CONTENT_DIR,
  KNOWN_URLS_FILE,
  redirects,
  walk,
  fileToRoute,
  isPartial,
  listPageRoutes,
  normalize,
  compileSource,
  matchRedirect,
  createResolver,
  readKnownUrls,
  loadSidebars,
  sidebarLinks,
  extractLinks,
  isAppRoute,
  registerTs,
}
