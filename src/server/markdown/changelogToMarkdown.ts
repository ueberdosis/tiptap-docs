import { getChangelogData } from '@/server/getChangelogData'
import { buildFrontmatter } from './fileToMarkdown'

/**
 * Build the `.md` response for a changelog page. Changelog pages are generated
 * from JSON data (see scripts/generate-changelogs.ts) and rendered by the
 * `resources/changelog/[slug]` route, not from `.mdx` files — so
 * resolveContentPath/fileToMarkdown can't see them. This mirrors the format
 * fileToMarkdown produces: frontmatter + H1 title + description + body.
 *
 * Returns null when no changelog exists for the slug (unknown or invalid slug),
 * so the caller can fall through to a 404.
 */
export function changelogToMarkdown(slug: string, canonicalUrl?: string): string | null {
  const data = getChangelogData(slug)
  if (!data) return null

  const title = `${data.packageName} changelog`
  const description = `Changelog for ${data.packageName}`
  const frontmatter = buildFrontmatter({ title, description, canonicalUrl })

  return `${[frontmatter, `# ${title}`, description, data.content].join('\n\n').trim()}\n`
}
