import * as fs from 'fs'
import * as path from 'path'

type RepoConfig = {
  owner: string
  repo: string
  branch: string
  slugPrefix: string
  packageScope: string
  packageDirs: string[]
  rootChangelogSlug: string
  rootChangelogTitle: string
}

const OSS_CONFIG: RepoConfig = {
  owner: 'ueberdosis',
  repo: 'tiptap',
  branch: 'main',
  slugPrefix: '',
  packageScope: '@tiptap',
  packageDirs: ['packages'],
  rootChangelogSlug: 'tiptap',
  rootChangelogTitle: 'Tiptap (open source)',
}

const REPO_CONFIGS: RepoConfig[] = [OSS_CONFIG]

const CONCURRENCY_LIMIT = 5
const OUTPUT_DIR = path.join(process.cwd(), 'src/content/resources/changelog/_data')

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

type ChangelogResult = {
  packageName: string
  slug: string
  content: string
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
  }
  return headers
}

/**
 * List directories under a path in a GitHub repo using the Contents API.
 */
async function listDirectories(
  config: RepoConfig,
  dirPath: string,
): Promise<string[]> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${dirPath}?ref=${config.branch}`
  const response = await fetch(url, { headers: getHeaders() })

  if (!response.ok) {
    console.warn(`Failed to list ${dirPath} in ${config.owner}/${config.repo}: ${response.status}`)
    return []
  }

  const entries = (await response.json()) as Array<{ name: string; type: string }>
  return entries.filter((e) => e.type === 'dir').map((e) => e.name)
}

/**
 * Fetch a CHANGELOG.md from GitHub raw content.
 */
async function fetchChangelog(
  config: RepoConfig,
  filePath: string,
): Promise<string | null> {
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
 * Process items with a concurrency limit.
 */
async function processWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit)
    const batchResults = await Promise.all(batch.map(fn))
    results.push(...batchResults)
  }

  return results
}

async function discoverAndFetchPackages(config: RepoConfig): Promise<ChangelogResult[]> {
  const allDirNames: Array<{ dirName: string; packageDir: string }> = []

  for (const packageDir of config.packageDirs) {
    const dirNames = await listDirectories(config, packageDir)
    console.log(`Found ${dirNames.length} directories in ${config.owner}/${config.repo}/${packageDir}`)
    for (const dirName of dirNames) {
      allDirNames.push({ dirName, packageDir })
    }
  }

  const total = allDirNames.length
  const results = await processWithConcurrency(
    allDirNames,
    CONCURRENCY_LIMIT,
    async ({ dirName, packageDir }, ) => {
      const index = allDirNames.findIndex((d) => d.dirName === dirName && d.packageDir === packageDir)
      const prefix = `[${index + 1}/${total}]`
      const packageName = `${config.packageScope}/${dirName}`
      const slug = `${config.slugPrefix}${dirName}`

      try {
        const content = await fetchChangelog(config, `${packageDir}/${dirName}/CHANGELOG.md`)

        if (!content) {
          console.warn(`${prefix} Skipped ${packageName} (no CHANGELOG)`)
          return null
        }

        console.log(`${prefix} Fetched ${packageName}`)
        return {
          packageName,
          slug,
          content: stripLeadingH1(content),
        } as ChangelogResult
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.warn(`${prefix} Skipped ${packageName} (error: ${message})`)
        return null
      }
    },
  )

  return results.filter((r): r is ChangelogResult => r !== null)
}

async function main() {
  if (!GITHUB_TOKEN) {
    console.warn(
      'Warning: GITHUB_TOKEN not set. Public repos will use unauthenticated requests (60/hr rate limit).',
    )
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const allResults: ChangelogResult[] = []

  for (const config of REPO_CONFIGS) {
    const results = await discoverAndFetchPackages(config)
    allResults.push(...results)
  }

  // Write individual package JSON files
  for (const result of allResults) {
    const filePath = path.join(OUTPUT_DIR, `${result.slug}.json`)
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
  }

  // Write index.json
  const index = allResults.map((r) => ({
    slug: r.slug,
    packageName: r.packageName,
  }))
  const indexPath = path.join(OUTPUT_DIR, 'index.json')
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
  console.log(`Wrote ${indexPath}`)

  // Write sidebar-items.json (sorted alphabetically by package name)
  const sidebarItems = allResults
    .map((r) => ({
      href: `/resources/changelog/${r.slug}`,
      title: r.packageName,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
  const sidebarPath = path.join(OUTPUT_DIR, 'sidebar-items.json')
  fs.writeFileSync(sidebarPath, JSON.stringify(sidebarItems, null, 2))
  console.log(`Wrote ${sidebarPath}`)

  console.log(`Done! Generated changelog data for ${allResults.length} package(s).`)
}

main().catch((error) => {
  console.error('Failed to generate changelogs:', error)
  process.exit(1)
})
