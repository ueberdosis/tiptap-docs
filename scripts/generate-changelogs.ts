import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import * as tar from 'tar'

type PackageEntry = {
  name: string
  slug: string
  registry: string
  /**
   * GitHub path to the CHANGELOG.md file (relative to repo root).
   * Used as a fallback when the npm tarball doesn't include CHANGELOG.md.
   * Format: "owner/repo/branch/path/to/CHANGELOG.md"
   */
  githubChangelog?: string
  /**
   * Authorization token for private registries.
   * Passed as `Authorization: Bearer <token>` header.
   */
  authToken?: string
}

const GITHUB_BASE = 'ueberdosis/tiptap/main'

function ossEntry(dirName: string): PackageEntry {
  return {
    name: `@tiptap/${dirName}`,
    slug: dirName,
    registry: 'https://registry.npmjs.org',
    githubChangelog: `${GITHUB_BASE}/packages/${dirName}/CHANGELOG.md`,
  }
}

function deprecatedEntry(dirName: string): PackageEntry {
  return {
    name: `@tiptap/${dirName}`,
    slug: dirName,
    registry: 'https://registry.npmjs.org',
    githubChangelog: `${GITHUB_BASE}/packages-deprecated/${dirName}/CHANGELOG.md`,
  }
}

/**
 * Resolve the Tiptap Pro registry auth token.
 * Checks (in order): TIPTAP_PRO_TOKEN env var, project .npmrc, ~/.npmrc.
 * Returns the token string or null if not found.
 */
function resolveProAuthToken(): string | null {
  // 1. Environment variable
  const envToken = process.env.TIPTAP_PRO_TOKEN
  if (envToken) {
    return envToken
  }

  // 2. Project root .npmrc
  const projectNpmrc = path.join(process.cwd(), '.npmrc')
  const token = parseNpmrcForToken(projectNpmrc)
  if (token) {
    return token
  }

  // 3. Home directory .npmrc
  const homeNpmrc = path.join(os.homedir(), '.npmrc')
  return parseNpmrcForToken(homeNpmrc)
}

/**
 * Parse an .npmrc file for the Tiptap Pro registry auth token.
 */
function parseNpmrcForToken(npmrcPath: string): string | null {
  try {
    if (!fs.existsSync(npmrcPath)) {
      return null
    }
    const content = fs.readFileSync(npmrcPath, 'utf-8')
    const match = content.match(/\/\/registry\.tiptap\.dev\/:_authToken=(.+)/)
    return match ? match[1].trim() : null
  } catch {
    return null
  }
}

const proAuthToken = resolveProAuthToken()

function proEntry(dirName: string): PackageEntry {
  return {
    name: `@tiptap-pro/${dirName}`,
    slug: `pro-${dirName}`,
    registry: 'https://registry.tiptap.dev',
    authToken: proAuthToken ?? undefined,
  }
}

const PRO_DIRS = [
  'ai-toolkit',
  'ai-toolkit-ai-sdk',
  'ai-toolkit-anthropic',
  'ai-toolkit-langchain',
  'ai-toolkit-openai',
  'ai-toolkit-tool-definitions',
  'extension-ai',
  'extension-ai-advanced',
  'extension-annotation',
  'extension-comments',
  'extension-document-colors',
  'extension-export',
  'extension-iframely',
  'extension-import',
  'extension-snapshot',
  'extension-snapshot-compare',
  'extension-tracked-changes',
  'provider',
  'server-ai-toolkit',
]

const ACTIVE_DIRS = [
  'core',
  'pm',
  'react',
  'vue-2',
  'vue-3',
  'starter-kit',
  'extensions',
  'html',
  'markdown',
  'static-renderer',
  'suggestion',
  'extension-audio',
  'extension-blockquote',
  'extension-bold',
  'extension-bubble-menu',
  'extension-bullet-list',
  'extension-code',
  'extension-code-block',
  'extension-code-block-lowlight',
  'extension-collaboration',
  'extension-collaboration-caret',
  'extension-color',
  'extension-details',
  'extension-document',
  'extension-drag-handle',
  'extension-drag-handle-react',
  'extension-drag-handle-vue-2',
  'extension-drag-handle-vue-3',
  'extension-emoji',
  'extension-file-handler',
  'extension-floating-menu',
  'extension-font-family',
  'extension-hard-break',
  'extension-heading',
  'extension-highlight',
  'extension-horizontal-rule',
  'extension-image',
  'extension-invisible-characters',
  'extension-italic',
  'extension-link',
  'extension-list',
  'extension-mathematics',
  'extension-mention',
  'extension-node-range',
  'extension-ordered-list',
  'extension-paragraph',
  'extension-strike',
  'extension-subscript',
  'extension-superscript',
  'extension-table',
  'extension-table-of-contents',
  'extension-text',
  'extension-text-align',
  'extension-text-style',
  'extension-twitch',
  'extension-typography',
  'extension-underline',
  'extension-unique-id',
  'extension-youtube',
]

const DEPRECATED_DIRS = [
  'extension-character-count',
  'extension-dropcursor',
  'extension-focus',
  'extension-gapcursor',
  'extension-history',
  'extension-list-item',
  'extension-list-keymap',
  'extension-placeholder',
  'extension-table-cell',
  'extension-table-header',
  'extension-table-row',
  'extension-task-item',
  'extension-task-list',
]

const PRO_PACKAGES: PackageEntry[] = proAuthToken
  ? PRO_DIRS.map(proEntry)
  : []

if (!proAuthToken) {
  console.warn(
    'Warning: No Tiptap Pro auth token found. Skipping pro packages.\n' +
      'Set TIPTAP_PRO_TOKEN env var or add //registry.tiptap.dev/:_authToken=<token> to .npmrc',
  )
}

const PACKAGES: PackageEntry[] = [
  ...ACTIVE_DIRS.map(ossEntry),
  ...DEPRECATED_DIRS.map(deprecatedEntry),
  ...PRO_PACKAGES,
]

const CONCURRENCY_LIMIT = 5

const OUTPUT_DIR = path.join(process.cwd(), 'src/content/resources/changelog/_data')

type ChangelogResult = {
  packageName: string
  slug: string
  version: string
  content: string
}

/**
 * Try to extract CHANGELOG.md from an npm tarball.
 * Returns the changelog content or null if not found.
 */
async function extractChangelogFromTarball(
  tarballUrl: string,
  authToken?: string,
): Promise<string | null> {
  const headers: Record<string, string> = {}
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }
  const tarballResponse = await fetch(tarballUrl, { headers })

  if (!tarballResponse.ok) {
    return null
  }

  const tarballBuffer = Buffer.from(await tarballResponse.arrayBuffer())
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-'))
  const tarballPath = path.join(tmpDir, 'package.tgz')

  try {
    fs.writeFileSync(tarballPath, tarballBuffer)

    await tar.x({
      file: tarballPath,
      cwd: tmpDir,
      filter: (filePath: string) => filePath === 'package/CHANGELOG.md',
    })

    const changelogPath = path.join(tmpDir, 'package', 'CHANGELOG.md')

    if (!fs.existsSync(changelogPath)) {
      return null
    }

    return fs.readFileSync(changelogPath, 'utf-8')
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

/**
 * Fetch CHANGELOG.md from GitHub raw content as a fallback.
 * The path format is: "owner/repo/branch/path/to/CHANGELOG.md"
 */
async function fetchChangelogFromGitHub(githubPath: string): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${githubPath}`
  const response = await fetch(url)

  if (!response.ok) {
    return null
  }

  return response.text()
}

async function fetchChangelog(
  entry: PackageEntry,
  index: number,
  total: number,
): Promise<ChangelogResult | null> {
  const prefix = `[${index + 1}/${total}]`

  try {
    const encodedName = entry.name.replace('/', '%2f')
    const metadataUrl = `${entry.registry}/${encodedName}/latest`

    const headers: Record<string, string> = {}
    if (entry.authToken) {
      headers['Authorization'] = `Bearer ${entry.authToken}`
    }

    const metaResponse = await fetch(metadataUrl, { headers })

    if (!metaResponse.ok) {
      console.warn(`${prefix} Skipped ${entry.name} (metadata fetch failed: ${metaResponse.status})`)
      return null
    }

    const metadata = (await metaResponse.json()) as {
      version: string
      dist: { tarball: string }
    }
    const version = metadata.version
    const tarballUrl = metadata.dist.tarball

    // Try to extract CHANGELOG.md from the npm tarball first
    let content = await extractChangelogFromTarball(tarballUrl, entry.authToken)

    // Fall back to GitHub if the tarball doesn't contain CHANGELOG.md
    if (!content && entry.githubChangelog) {
      content = await fetchChangelogFromGitHub(entry.githubChangelog)
    }

    if (!content) {
      console.warn(`${prefix} Skipped ${entry.name} (no CHANGELOG)`)
      return null
    }

    console.log(`${prefix} Fetched ${entry.name}`)
    return {
      packageName: entry.name,
      slug: entry.slug,
      version,
      content,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`${prefix} Skipped ${entry.name} (error: ${message})`)
    return null
  }
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

/**
 * Remove the leading H1 heading from markdown content (e.g. "# Change Log").
 * The page already has its own title, so the H1 would be redundant.
 */
function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\s*#\s+[^\n]+\n*/, '')
}

async function main() {
  const total = PACKAGES.length
  console.log(`Generating changelog data for ${total} packages...`)

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const allResults = await processWithConcurrency(
    PACKAGES,
    CONCURRENCY_LIMIT,
    (entry) => fetchChangelog(entry, PACKAGES.indexOf(entry), total),
  )

  const results: ChangelogResult[] = allResults.filter(
    (r): r is ChangelogResult => r !== null,
  )

  // Write individual package JSON files
  for (const result of results) {
    result.content = stripLeadingH1(result.content)
    const filePath = path.join(OUTPUT_DIR, `${result.slug}.json`)
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
  }

  // Write index.json
  const index = results.map((r) => ({
    slug: r.slug,
    packageName: r.packageName,
    version: r.version,
  }))
  const indexPath = path.join(OUTPUT_DIR, 'index.json')
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
  console.log(`Wrote ${indexPath}`)

  // Write sidebar-items.json (sorted alphabetically by package name)
  const sidebarItems = results
    .map((r) => ({
      href: `/resources/changelog/${r.slug}`,
      title: r.packageName,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
  const sidebarPath = path.join(OUTPUT_DIR, 'sidebar-items.json')
  fs.writeFileSync(sidebarPath, JSON.stringify(sidebarItems, null, 2))
  console.log(`Wrote ${sidebarPath}`)

  console.log(`Done! Generated changelog data for ${results.length}/${total} package(s).`)
}

main().catch((error) => {
  console.error('Failed to generate changelogs:', error)
  process.exit(1)
})
