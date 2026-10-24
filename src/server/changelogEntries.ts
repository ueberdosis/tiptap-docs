import { getChangelogData, getChangelogIndex } from './getChangelogData'
import { getCatalog } from './getCatalog'

// The package changelogs as single entries: one change of one package in one
// version, without the "Updated dependencies" noise. The changelog page and the
// "Changes" section of feature pages read from here, so both show the same.

/** The page with a package's full history. */
export const historyUrl = (slug: string) => ['/resources/changelog', slug].join('/')

/** Breaking for major, New for minor, Fixed for patch changesets. */
export type ChangeType = 'Breaking' | 'New' | 'Fixed'

export type ChangelogEntry = {
  packageName: string
  /** The archive page of the package, `/resources/changelog/<slug>`. */
  slug: string
  version: string
  /** The day the version came out (YYYY-MM-DD), when the registry told. */
  date?: string
  type: ChangeType
  /** The change as Markdown. */
  text: string
  /** The feature the package belongs to, or the package's name. */
  feature: { name: string; url?: string }
}

const TYPES: Record<string, ChangeType> = {
  'major changes': 'Breaking',
  'minor changes': 'New',
  'patch changes': 'Fixed',
}

/** "Updated dependencies", a bare `@tiptap/core@3.31.3`, or "License updates": not a change to read. */
const isDependencyBump = (text: string) =>
  /^Updated dependencies\b/.test(text) ||
  /^(?:[-\s]*@[\w-]+\/[\w-]+@\S+\s*)+$/.test(text) ||
  /^License updates?\.?$/i.test(text)

/** One package's changelog, split into its changes. */
export function parseChangelog(
  content: string,
): Array<{ version: string; type: ChangeType; text: string }> {
  const entries: Array<{ version: string; type: ChangeType; text: string }> = []
  let version = ''
  let type: ChangeType = 'Fixed'
  let item: string[] = []

  const flush = () => {
    const text = item.join('\n').trim()
    if (version && text && !isDependencyBump(text)) entries.push({ version, type, text })
    item = []
  }

  for (const line of content.split('\n')) {
    const versionHeading = line.match(/^## (\S+)/)
    const typeHeading = line.match(/^### (.+)/)
    if (versionHeading || typeHeading) {
      flush()
      if (versionHeading) version = versionHeading[1]
      if (typeHeading) type = TYPES[typeHeading[1].trim().toLowerCase()] ?? 'Fixed'
    } else if (line.startsWith('- ')) {
      flush()
      item.push(line.slice(2))
    } else if (item.length) {
      // A wrapped line or a nested list belongs to the change above
      item.push(line.replace(/^ {2}/, ''))
    }
  }
  flush()
  return entries
}

/** Compares versions such as `3.31.4` and `3.0.0-beta.2`, newest first. */
export function compareVersions(a: string, b: string): number {
  const parse = (version: string) => {
    const [main, pre] = version.split('-')
    return { parts: main.split('.').map(Number), pre }
  }
  const left = parse(a)
  const right = parse(b)
  for (let i = 0; i < 3; i++) {
    const diff = (right.parts[i] ?? 0) - (left.parts[i] ?? 0)
    if (diff) return diff
  }
  if (left.pre === right.pre) return 0
  if (!left.pre) return -1
  if (!right.pre) return 1
  return right.pre.localeCompare(left.pre, undefined, { numeric: true })
}

const isPrerelease = (version: string) => version.includes('-')

// Packages without a feature page that readers know by a name
const PACKAGE_NAMES: Record<string, string> = {
  '@tiptap/core': 'Core',
  '@tiptap/pm': 'ProseMirror',
  '@tiptap/react': 'React',
  '@tiptap/vue-2': 'Vue 2',
  '@tiptap/vue-3': 'Vue 3',
  '@tiptap/html': 'HTML utility',
  '@tiptap/static-renderer': 'Static renderer',
  '@tiptap/markdown': 'Markdown',
}

let entries: ChangelogEntry[] | undefined

/** Every change of every published package, newest version first. */
export function getChangelogEntries(): ChangelogEntry[] {
  if (entries) return entries

  const features = new Map<string, { name: string; url?: string }>()
  for (const entry of getCatalog()) {
    for (const packageName of entry.package?.split(/\s+/) ?? []) {
      if (!features.has(packageName))
        features.set(packageName, { name: entry.name, url: entry.url })
    }
  }

  entries = getChangelogIndex().flatMap(({ slug }) => {
    const data = getChangelogData(slug)
    if (!data) return []
    const changes = parseChangelog(data.content)
    // Pre-releases only count for a package that has no stable version yet
    const hasStable = changes.some((change) => !isPrerelease(change.version))
    return changes
      .filter((change) => !hasStable || !isPrerelease(change.version))
      .map((change) => ({
        ...change,
        packageName: data.packageName,
        slug,
        date: data.dates?.[change.version],
        feature: features.get(data.packageName) ?? {
          name: PACKAGE_NAMES[data.packageName] ?? data.packageName,
        },
      }))
  })
  entries.sort((a, b) => compareVersions(a.version, b.version))
  return entries
}

/**
 * The package a feature is named after, such as `@tiptap-pro/extension-pages`
 * for Pages; otherwise the first one its install command names.
 */
export function mainPackage(feature: { name: string; package?: string }): string | undefined {
  const packages = feature.package?.split(/\s+/).filter(Boolean) ?? []
  const slug = feature.name.toLowerCase().replace(/\s+/g, '-')
  return (
    packages.find(
      (name) =>
        name
          .split('/')
          .pop()!
          .replace(/^extension-/, '') === slug,
    ) ?? packages[0]
  )
}

/**
 * The newest published version of a package, with its day and history page,
 * whether or not it changed more than dependencies.
 */
export function getLatestVersion(
  packageName: string,
): { version: string; date?: string; slug: string } | undefined {
  const entry = getChangelogIndex().find((candidate) => candidate.packageName === packageName)
  const data = entry && getChangelogData(entry.slug)
  if (!data) return undefined
  const versions = [...data.content.matchAll(/^## (\S+)/gm)].map((match) => match[1])
  const version = versions.find((candidate) => !isPrerelease(candidate)) ?? versions[0]
  return version ? { version, date: data.dates?.[version], slug: data.slug } : undefined
}

export type Release = { version: string; date?: string; entries: ChangelogEntry[] }

/**
 * Open source packages are released together, so their changes group into
 * releases, such as Tiptap 3.32.0, with the newest first.
 */
export function getOpenSourceReleases(limit: number): Release[] {
  const releases = new Map<string, Release>()
  for (const entry of getChangelogEntries()) {
    if (!entry.packageName.startsWith('@tiptap/') || isPrerelease(entry.version)) continue
    const release = releases.get(entry.version) ?? { version: entry.version, entries: [] }
    release.date ??= entry.date
    release.entries.push(entry)
    releases.set(entry.version, release)
  }
  return [...releases.values()]
    .sort((a, b) => compareVersions(a.version, b.version))
    .slice(0, limit)
}

/**
 * Pro packages each have their own version, so each Pro feature shows the
 * latest version of its main package that changed something, newest first when
 * the dates are known.
 */
export function getProUpdates(): Array<Release & { feature: ChangelogEntry['feature'] }> {
  const all = getChangelogEntries()
  return getCatalog()
    .flatMap((feature) => {
      const main = mainPackage(feature)
      if (!main?.startsWith('@tiptap-pro/') || !feature.url) return []
      const changes = all.filter((entry) => entry.packageName === main)
      if (!changes.length) return []
      const { version, date } = changes[0]
      return [
        {
          version,
          date,
          entries: changes.filter((entry) => entry.version === version),
          feature: { name: feature.name, url: feature.url },
        },
      ]
    })
    .sort(
      (a, b) =>
        (b.date ?? '').localeCompare(a.date ?? '') || a.feature.name.localeCompare(b.feature.name),
    )
}

/** Every package with a history page, by name. */
export function getPackageHistories(): Array<{ packageName: string; slug: string }> {
  return [...getChangelogIndex()].sort((a, b) => a.packageName.localeCompare(b.packageName))
}

/** "2026-10-13" → "Oct 13, 2026". */
export function formatDay(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const dayLabel = (day?: string) => (day ? ` (${formatDay(day)})` : '')

function entryLine(entry: ChangelogEntry, showFeature = true): string {
  const feature = entry.feature.url
    ? `[${entry.feature.name}](${entry.feature.url})`
    : entry.feature.name
  // Continuation lines stay inside the list item
  const text = entry.text.replace(/\n/g, '\n  ')
  return `- **${entry.type}**${showFeature ? ` · ${feature}` : ''}: ${text}`
}

/** The changelog page's sections as Markdown, for the `.md` route and agents. */
export const changelogMarkdown = {
  releases: (limit = 6) =>
    getOpenSourceReleases(limit)
      .map((release) =>
        [
          `### Tiptap ${release.version}${dayLabel(release.date)}`,
          ...release.entries.map((entry) => entryLine(entry)),
        ].join('\n'),
      )
      .join('\n\n'),
  pro: () =>
    getProUpdates()
      .map((update) =>
        [
          `### [${update.feature.name}](${update.feature.url}) ${update.version}${dayLabel(update.date)}`,
          ...update.entries.map((entry) => entryLine(entry, false)),
        ].join('\n'),
      )
      .join('\n\n'),
  packages: () =>
    getPackageHistories()
      .map(({ packageName, slug }) => `- [\`${packageName}\`](${historyUrl(slug)})`)
      .join('\n'),
}
