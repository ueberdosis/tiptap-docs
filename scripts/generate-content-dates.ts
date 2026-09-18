import { execFileSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Build-time generator: maps every `src/content/**\/*.mdx` file to the date of
 * its most recent change on the deployed branch (YYYY-MM-DD). The markdown
 * endpoint reads this manifest at request time to emit a `last_updated`
 * frontmatter field, since the deployed standalone bundle ships no `.git`.
 *
 * Keys are paths relative to `src/content` (forward slashes), e.g.
 * `editor/extensions/nodes/code-block.mdx`.
 */

const CONTENT_REL = 'src/content'
const CONTENT_DIR = path.join(process.cwd(), CONTENT_REL)
const OUTPUT_PATH = path.join(process.cwd(), 'src/server/markdown/contentDates.generated.json')

// Prefixes each commit's date line in the `git log` output. A NUL can't be used
// (it would truncate the format argv); no content path starts with this token.
const COMMIT_MARKER = '@@COMMIT@@'

function isShallowRepo(): boolean {
  return (
    execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim() ===
    'true'
  )
}

/**
 * CI providers (Vercel, GitHub Actions, …) clone shallow, which collapses every
 * file's history to the deploy commit — so `git log` reports the same date for
 * all of them. Fetch full history first so per-file dates are real.
 *
 * Returns whether we ended up with usable (non-shallow) history. When it's still
 * shallow, the caller omits dates rather than emit a misleading uniform one.
 */
function ensureFullGitHistory(): boolean {
  try {
    if (!isShallowRepo()) return true
  } catch {
    console.warn('Warning: could not determine git clone depth; assuming complete.')
    return true
  }

  console.log('Shallow clone detected; fetching full history (git fetch --unshallow)…')
  try {
    execFileSync('git', ['fetch', '--unshallow', '--quiet'], { stdio: 'inherit' })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`Warning: git fetch --unshallow failed (${message}).`)
  }

  // Re-check: if still shallow, every date would be the deploy date.
  try {
    return !isShallowRepo()
  } catch {
    return false
  }
}

/**
 * Last-change date per content file, from a single `git log` pass.
 *
 * - `--first-parent`: walk only the deployed mainline, so a change is dated when
 *   it *landed* (via merge), consistently — not by whichever side-branch commit
 *   git's default history simplification happens to pick.
 * - `--diff-merges=first-parent`: make merge commits list the files they brought
 *   in (a plain `--name-only` shows nothing for merges, dropping their changes).
 * - newest-first output → the first time we see a path is its latest change.
 */
function collectContentDates(): Record<string, string> {
  const dates: Record<string, string> = {}

  let output: string
  try {
    output = execFileSync(
      'git',
      [
        'log',
        '--first-parent',
        '--diff-merges=first-parent',
        `--format=${COMMIT_MARKER}%cs`,
        '--name-only',
        '--',
        CONTENT_REL,
      ],
      { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`Warning: git log failed (${message}); content dates will be omitted.`)
    return dates
  }

  let currentDate: string | null = null
  for (const line of output.split('\n')) {
    if (line.startsWith(COMMIT_MARKER)) {
      currentDate = line.slice(COMMIT_MARKER.length).trim() || null
      continue
    }
    if (!currentDate) continue

    const repoPath = line.trim()
    if (!repoPath.startsWith(`${CONTENT_REL}/`) || !repoPath.endsWith('.mdx')) continue

    const key = repoPath.slice(`${CONTENT_REL}/`.length)
    if (!(key in dates)) dates[key] = currentDate
  }

  return dates
}

/** Every `.mdx` under src/content, keyed relative to it with forward slashes. */
function listContentFiles(dir: string, base = CONTENT_DIR): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listContentFiles(full, base))
    else if (entry.isFile() && entry.name.endsWith('.mdx'))
      out.push(path.relative(base, full).split(path.sep).join('/'))
  }
  return out
}

function main() {
  const files = listContentFiles(CONTENT_DIR).sort()
  const total = files.length

  if (!ensureFullGitHistory()) {
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify({}, null, 2)}\n`)
    console.warn(
      `Wrote ${OUTPUT_PATH} with 0 dates: git history is shallow and could not be ` +
        'unshallowed, so last_updated is omitted rather than set to the deploy date for every page.',
    )
    return
  }

  console.log(`Found ${total} content file(s) under ${CONTENT_REL}; reading git history…`)
  const gitDates = collectContentDates()

  const manifest: Record<string, string> = {}
  let missing = 0
  files.forEach((key, index) => {
    const date = gitDates[key]
    const prefix = `[${index + 1}/${total}]`
    if (date) {
      manifest[key] = date
      console.log(`${prefix} Dated ${key} → ${date}`)
    } else {
      missing++
      console.warn(`${prefix} No git date for ${key} (last_updated omitted)`)
    }
  })

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Wrote ${OUTPUT_PATH}`)
  console.log(
    `Done! Dated ${Object.keys(manifest).length} content file(s)` +
      (missing ? `; ${missing} without a git date (last_updated omitted for those).` : '.'),
  )
}

try {
  main()
} catch (error) {
  console.error('Failed to generate content dates:', error)
  process.exit(1)
}
