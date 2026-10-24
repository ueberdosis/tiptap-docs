import { getChangelogData, getChangelogIndex } from './getChangelogData'
import { getCatalog } from './getCatalog'
import { BREAKING_NOTES, BreakingNote } from '@/content/resources/changelog-breaking'

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
  /** For a breaking change: what changes, who is affected, how to migrate. */
  breaking?: Omit<BreakingNote, 'match'>
  /** The feature the package belongs to, or the package's name. */
  feature: { name: string; url?: string; group?: string }
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
    } else if (item.length && !/^\s+- @[\w-]+\/[\w-]+@\S+\s*$/.test(line)) {
      // A wrapped line or a nested list belongs to the change above, except a dependency bump
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

/** The hand-written note for a breaking change, if there is one. */
function breakingNote(
  packageName: string,
  version: string,
  text: string,
): Omit<BreakingNote, 'match'> | undefined {
  const note = BREAKING_NOTES.find(({ match }) => {
    const packages = match.packages
    const inPackages = Array.isArray(packages)
      ? packages.includes(packageName)
      : packageName.startsWith(packages.scope)
    return inPackages && match.version === version && text.startsWith(match.startsWith)
  })
  return note && { what: note.what, who: note.who, migrate: note.migrate, url: note.url }
}

let entries: ChangelogEntry[] | undefined

/** Every change of every published package, newest version first. */
export function getChangelogEntries(): ChangelogEntry[] {
  if (entries) return entries

  const features = new Map<string, ChangelogEntry['feature']>()
  for (const entry of getCatalog()) {
    for (const packageName of entry.package?.split(/\s+/) ?? []) {
      if (!features.has(packageName))
        features.set(packageName, { name: entry.name, url: entry.url, group: entry.group })
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
        breaking: breakingNote(data.packageName, change.version, change.text),
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
export function getPackageHistories(): Array<{
  packageName: string
  slug: string
  name: string
  source: Source
}> {
  return getChangelogIndex()
    .map(({ packageName, slug }) => ({
      packageName,
      slug,
      name: packageDisplayName(packageName),
      source: sourceOf(packageName),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export type Source = 'Open source' | 'Pro'

const sourceOf = (packageName: string): Source =>
  packageName.startsWith('@tiptap-pro/') ? 'Pro' : 'Open source'

// Words a package name spells in capitals or as a product name
const SPELLED: Record<string, string> = {
  anthropic: 'Anthropic',
  langchain: 'LangChain',
  openai: 'OpenAI',
  react: 'React',
  toolkit: 'Toolkit',
  tiptap: 'Tiptap',
  vue: 'Vue',
  ai: 'AI',
  api: 'API',
  doc: 'DOC',
  docx: 'DOCX',
  epub: 'EPUB',
  html: 'HTML',
  id: 'ID',
  odt: 'ODT',
  pdf: 'PDF',
  sdk: 'SDK',
  ui: 'UI',
}

let featureNames: Map<string, string> | undefined

/**
 * A package as readers name it: the feature it is the main package of, such as
 * "Comments", or its name in words, in sentence case, such as "Client AI Toolkit OpenAI".
 */
export function packageDisplayName(packageName: string): string {
  if (!featureNames) {
    // A package several features share, such as @tiptap/extensions, keeps its own name
    // unless it is named after one of them
    const byPackage = new Map<string, string[]>()
    for (const feature of getCatalog()) {
      const main = mainPackage(feature)
      if (main && feature.url) byPackage.set(main, [...(byPackage.get(main) ?? []), feature.name])
    }
    featureNames = new Map()
    for (const [main, names] of byPackage) {
      const own = main
        .split('/')
        .pop()!
        .replace(/^extension-/, '')
      const named = names.find((name) => name.toLowerCase().replace(/\s+/g, '-') === own)
      if (named || names.length === 1) featureNames.set(main, named ?? names[0])
    }
  }
  const known = featureNames.get(packageName) ?? PACKAGE_NAMES[packageName]
  if (known) return known
  return packageName
    .split('/')
    .pop()!
    .replace(/^extension-/, '')
    .split('-')
    .map(
      (word, i) => SPELLED[word] ?? (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word),
    )
    .join(' ')
}

/** One release in a timeline: a version with its changes. */
export type TimelineItem = {
  id: string
  title: string
  version: string
  date?: string
  source: Source
  link?: { label: string; href: string }
  entries: ChangelogEntry[]
}

/**
 * Every Tiptap release in one timeline, newest first: the latest open source
 * releases and the latest version of each Pro feature. Releases without a known
 * day come last.
 */
export function getReleaseTimeline(openSourceReleases = 6): TimelineItem[] {
  const openSource: TimelineItem[] = getOpenSourceReleases(openSourceReleases).map((release) => ({
    id: `v${release.version}`,
    title: `Tiptap ${release.version}`,
    version: release.version,
    date: release.date,
    source: 'Open source',
    link: {
      label: 'Release on GitHub',
      href: `https://github.com/ueberdosis/tiptap/releases/tag/v${release.version}`,
    },
    entries: release.entries,
  }))
  const pro: TimelineItem[] = getProUpdates().map((update) => ({
    id: `${update.entries[0].slug}-${update.version}`,
    title: `${update.feature.name} ${update.version}`,
    version: update.version,
    date: update.date,
    source: 'Pro',
    link: { label: 'Full history', href: historyUrl(update.entries[0].slug) },
    entries: update.entries,
  }))
  return [...openSource, ...pro].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

/**
 * One package's history as a timeline: each version that changed something.
 * Versions that only updated dependencies are counted, not listed.
 */
export function getPackageTimeline(slug: string) {
  const data = getChangelogData(slug)
  if (!data) return undefined
  const changes = parseChangelog(data.content)
  const versions = [...data.content.matchAll(/^## (\S+)/gm)].map((match) => match[1])
  const items: TimelineItem[] = []
  for (const version of versions) {
    const entries = changes
      .filter((change) => change.version === version)
      .map((change) => ({
        ...change,
        packageName: data.packageName,
        slug,
        date: data.dates?.[version],
        breaking: breakingNote(data.packageName, version, change.text),
        feature: { name: packageDisplayName(data.packageName) },
      }))
    if (entries.length) {
      items.push({
        id: `v${version}`,
        title: version,
        version,
        date: data.dates?.[version],
        source: sourceOf(data.packageName),
        entries,
      })
    }
  }
  return {
    packageName: data.packageName,
    name: packageDisplayName(data.packageName),
    items,
    quietVersions: versions.length - items.length,
  }
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
  const note = entry.breaking
    ? `\n  - What changes: ${entry.breaking.what}\n  - Who is affected: ${entry.breaking.who}\n  - How to migrate: ${entry.breaking.migrate}${entry.breaking.url ? ` [Details](${entry.breaking.url})` : ''}`
    : ''
  return `- **${entry.type}**${showFeature ? ` · ${feature}` : ''}: ${text}${note}`
}

/** The changelog page's sections as Markdown, for the `.md` route and agents. */
export const changelogMarkdown = {
  releases: () =>
    getReleaseTimeline()
      .map((item) =>
        [
          `### ${item.title}${dayLabel(item.date)} · ${item.source}`,
          ...item.entries.map((entry) => entryLine(entry, item.source === 'Open source')),
        ].join('\n'),
      )
      .join('\n\n'),
  packages: () =>
    getPackageHistories()
      .map(
        ({ name, packageName, slug, source }) =>
          `- [${name}](${historyUrl(slug)}): \`${packageName}\`${source === 'Pro' ? ' (Pro)' : ''}`,
      )
      .join('\n'),
}
