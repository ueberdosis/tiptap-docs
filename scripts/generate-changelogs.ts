import * as fs from 'fs'
import * as path from 'path'

type RepoConfig = {
  owner: string
  repo: string
  branch: string
  slugPrefix: string
  packageScope: string
  packageDirs: string[]
  rootSlug: string
  rootPackageName: string
  rootChangelogPath: string
}

const OSS_CONFIG: RepoConfig = {
  owner: 'ueberdosis',
  repo: 'tiptap',
  branch: 'main',
  slugPrefix: '',
  packageScope: '@tiptap',
  packageDirs: ['packages', 'packages-deprecated'],
  rootSlug: 'tiptap',
  rootPackageName: 'Tiptap',
  rootChangelogPath: 'CHANGELOG.md',
}

const PRO_CONFIG: RepoConfig = {
  owner: 'ueberdosis',
  repo: 'tiptap-pro',
  branch: 'main',
  slugPrefix: 'pro-',
  packageScope: '@tiptap-pro',
  packageDirs: ['packages'],
  rootSlug: 'tiptap-pro',
  rootPackageName: 'Tiptap Pro',
  rootChangelogPath: 'CHANGELOG.md',
}

const REPO_CONFIGS: RepoConfig[] = [OSS_CONFIG, PRO_CONFIG]

const CONCURRENCY_LIMIT = 5
const OUTPUT_DIR = path.join(process.cwd(), 'src/content/resources/changelog/_data')
const CACHE_PATH = path.join(OUTPUT_DIR, 'cache.json')

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

type ChangelogResult = {
  packageName: string
  slug: string
  content: string
}

type CacheEntry = {
  slug: string
  packageName: string
  source: string
  version: string
}

type CacheManifest = {
  entries: CacheEntry[]
}

// eslint-disable-next-line no-unused-vars
type ConcurrencyWorker<T, R> = (item: T, index: number) => Promise<R>

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
  }
  return headers
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isChangelogResult(value: unknown): value is ChangelogResult {
  return (
    isRecord(value) &&
    typeof value.packageName === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.content === 'string'
  )
}

function isCacheEntry(value: unknown): value is CacheEntry {
  return (
    isRecord(value) &&
    typeof value.slug === 'string' &&
    typeof value.packageName === 'string' &&
    typeof value.source === 'string' &&
    typeof value.version === 'string'
  )
}

function readJsonFile(filePath: string): unknown | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

function readCacheManifest(): Map<string, CacheEntry> {
  const data = readJsonFile(CACHE_PATH)

  if (!isRecord(data) || !Array.isArray(data.entries)) {
    return new Map()
  }

  return new Map(
    data.entries.filter(isCacheEntry).map((entry) => [`${entry.source}:${entry.slug}`, entry]),
  )
}

function writeCacheManifest(entries: CacheEntry[]) {
  const payload: CacheManifest = {
    entries: entries.sort((a, b) => a.slug.localeCompare(b.slug)),
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(payload, null, 2))
}

function readExistingChangelog(slug: string): ChangelogResult | null {
  const filePath = path.join(OUTPUT_DIR, `${slug}.json`)
  const data = readJsonFile(filePath)

  return isChangelogResult(data) ? data : null
}

function clearGeneratedOutput() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    return
  }

  for (const entry of fs.readdirSync(OUTPUT_DIR)) {
    if (entry.endsWith('.json')) {
      fs.unlinkSync(path.join(OUTPUT_DIR, entry))
    }
  }
}

function get403Warning(config: RepoConfig, dirPath: string, response: Response): string {
  const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
  const rateLimitReset = response.headers.get('X-RateLimit-Reset')

  if (rateLimitRemaining === '0') {
    let resetHint = ''

    if (rateLimitReset) {
      const resetTimestamp = Number(rateLimitReset)

      if (!Number.isNaN(resetTimestamp)) {
        resetHint = ` Rate limit resets at ${new Date(resetTimestamp * 1000).toISOString()}.`
      }
    }

    return (
      `Warning: GitHub API rate limit exceeded while accessing ` +
      `${config.owner}/${config.repo}/${dirPath} (HTTP 403).${resetHint} Skipping.`
    )
  }

  return (
    `Warning: Cannot access ${config.owner}/${config.repo}/${dirPath} (HTTP 403). ` +
    `This may be a private repo or a permissions/SSO issue. Skipping.`
  )
}

/**
 * List directories under a path in a GitHub repo using the Contents API.
 */
async function listDirectories(config: RepoConfig, dirPath: string): Promise<string[]> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${dirPath}?ref=${config.branch}`
  const response = await fetch(url, { headers: getHeaders() })

  if (!response.ok) {
    if (response.status === 404) {
      console.warn(
        `Warning: Cannot access ${config.owner}/${config.repo}/${dirPath} (HTTP 404). Skipping.`,
      )
    } else if (response.status === 403) {
      console.warn(get403Warning(config, dirPath, response))
    } else {
      console.warn(
        `Failed to list ${dirPath} in ${config.owner}/${config.repo}: ${response.status}`,
      )
    }
    return []
  }

  const entries = (await response.json()) as Array<{ name: string; type: string }>
  return entries.filter((e) => e.type === 'dir').map((e) => e.name)
}

async function fetchPackageVersion(config: RepoConfig, filePath: string): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${filePath}`
  const response = await fetch(url, { headers: getHeaders() })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { version?: unknown }

  return typeof data.version === 'string' ? data.version : null
}

/**
 * Fetch a CHANGELOG.md from GitHub raw content.
 */
async function fetchChangelog(config: RepoConfig, filePath: string): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${filePath}`
  const response = await fetch(url, { headers: getHeaders() })

  if (!response.ok) {
    return null
  }

  return response.text()
}

/**
 * Remove the leading H1 heading from markdown content.
 */
function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\s*#\s+[^\n]+\n*/, '')
}

/**
 * Process items with a sliding-window concurrency limit.
 * Starts a new task as soon as any slot frees up, keeping all slots busy.
 */
async function processWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: ConcurrencyWorker<T, R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++
      results[i] = await fn(items[i], i)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()))
  return results
}

async function discoverAndFetchPackages(
  config: RepoConfig,
  cacheEntries: Map<string, CacheEntry>,
): Promise<{ results: ChangelogResult[]; nextCacheEntries: CacheEntry[] }> {
  const allDirNames: Array<{ dirName: string; packageDir: string }> = []

  for (const packageDir of config.packageDirs) {
    const dirNames = await listDirectories(config, packageDir)
    console.log(
      `Found ${dirNames.length} directories in ${config.owner}/${config.repo}/${packageDir}`,
    )
    for (const dirName of dirNames) {
      allDirNames.push({ dirName, packageDir })
    }
  }

  const total = allDirNames.length
  const results = await processWithConcurrency(
    allDirNames,
    CONCURRENCY_LIMIT,
    async ({ dirName, packageDir }, index) => {
      const prefix = `[${index + 1}/${total}]`
      const packageName = `${config.packageScope}/${dirName}`
      const slug = `${config.slugPrefix}${dirName}`
      const source = `${config.owner}/${config.repo}/${packageDir}/${dirName}`

      try {
        const version = await fetchPackageVersion(config, `${packageDir}/${dirName}/package.json`)
        const cacheKey = `${source}:${slug}`
        const cachedEntry = cacheEntries.get(cacheKey)

        if (version && cachedEntry?.version === version) {
          const cachedResult = readExistingChangelog(slug)

          if (cachedResult) {
            console.log(`${prefix} Reused ${packageName}`)
            return {
              result: cachedResult,
              cacheEntry: {
                slug,
                packageName,
                source,
                version,
              } as CacheEntry,
            }
          }
        }

        const content = await fetchChangelog(config, `${packageDir}/${dirName}/CHANGELOG.md`)

        if (!content) {
          console.warn(`${prefix} Skipped ${packageName} (no CHANGELOG)`)
          return null
        }

        console.log(`${prefix} Fetched ${packageName}`)
        return {
          result: {
            packageName,
            slug,
            content: stripLeadingH1(content),
          } as ChangelogResult,
          cacheEntry: version
            ? ({
                slug,
                packageName,
                source,
                version,
              } as CacheEntry)
            : null,
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.warn(`${prefix} Skipped ${packageName} (error: ${message})`)
        return null
      }
    },
  )

  const nextCacheEntries: CacheEntry[] = []
  const nextResults: ChangelogResult[] = []

  for (const entry of results) {
    if (!entry) {
      continue
    }

    nextResults.push(entry.result)

    if (entry.cacheEntry) {
      nextCacheEntries.push(entry.cacheEntry)
    }
  }

  return {
    results: nextResults,
    nextCacheEntries,
  }
}

async function fetchRootChangelog(config: RepoConfig): Promise<ChangelogResult | null> {
  const content = await fetchChangelog(config, config.rootChangelogPath)

  if (!content) {
    console.warn(
      `Warning: Missing root changelog for ${config.owner}/${config.repo}/${config.rootChangelogPath}.`,
    )
    return null
  }

  return {
    packageName: config.rootPackageName,
    slug: config.rootSlug,
    content: stripLeadingH1(content),
  }
}

async function main() {
  if (process.env.SKIP_CHANGELOGS === '1') {
    console.log('Skipping changelog generation because SKIP_CHANGELOGS=1')
    return
  }

  if (!GITHUB_TOKEN) {
    console.warn(
      'Warning: GITHUB_TOKEN not set. Public repos will use unauthenticated requests (60/hr rate limit).',
    )
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const cacheEntries = readCacheManifest()

  const repoResults = await Promise.all(
    REPO_CONFIGS.map(async (config) => {
      try {
        const [rootResult, packageResults] = await Promise.all([
          fetchRootChangelog(config),
          discoverAndFetchPackages(config, cacheEntries),
        ])

        return {
          rootResult,
          packageResults,
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.warn(
          `Warning: Failed to process ${config.owner}/${config.repo}: ${message}. Skipping.`,
        )
        return {
          rootResult: null,
          packageResults: {
            results: [],
            nextCacheEntries: [],
          },
        }
      }
    }),
  )

  const rootResults = repoResults.flatMap((repoResult) =>
    repoResult.rootResult ? [repoResult.rootResult] : [],
  )
  const packageResults = repoResults
    .flatMap((repoResult) => repoResult.packageResults.results)
    .sort((a, b) => a.packageName.localeCompare(b.packageName))
  const nextCacheEntries = repoResults.flatMap(
    (repoResult) => repoResult.packageResults.nextCacheEntries,
  )
  const allResults: ChangelogResult[] = [...rootResults, ...packageResults]

  clearGeneratedOutput()

  for (const result of allResults) {
    const filePath = path.join(OUTPUT_DIR, `${result.slug}.json`)
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
  }

  const index = allResults.map((r) => ({
    slug: r.slug,
    packageName: r.packageName,
  }))
  const indexPath = path.join(OUTPUT_DIR, 'index.json')
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
  console.log(`Wrote ${indexPath}`)

  const sidebarItems = allResults.map((r) => ({
    href: `/resources/changelog/${r.slug}`,
    title: r.packageName,
  }))
  const sidebarPath = path.join(OUTPUT_DIR, 'sidebar-items.json')
  fs.writeFileSync(sidebarPath, JSON.stringify(sidebarItems, null, 2))
  console.log(`Wrote ${sidebarPath}`)
  writeCacheManifest(nextCacheEntries)

  console.log(`Done! Generated changelog data for ${allResults.length} package(s).`)
}

main().catch((error) => {
  console.error('Failed to generate changelogs:', error)
  process.exit(1)
})
