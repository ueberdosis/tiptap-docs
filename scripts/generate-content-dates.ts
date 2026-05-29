import { execFile, execFileSync } from 'child_process'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

/**
 * Git calls are spawn-bound (mostly waiting on subprocess I/O), so oversubscribe
 * the CPUs a bit. Scale to the host and clamp to a sane range.
 */
const CPU_COUNT =
  typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length
const CONCURRENCY = Math.max(4, Math.min(32, CPU_COUNT * 2))

/**
 * Build-time generator: maps every `src/content/**\/*.mdx` file to the date of
 * its most recent git commit (YYYY-MM-DD). The markdown endpoint reads this
 * manifest at request time to emit a `last_updated` frontmatter field, since
 * the deployed standalone bundle ships no `.git` to query live.
 *
 * Keys are paths relative to `src/content` (forward slashes), e.g.
 * `editor/extensions/nodes/code-block.mdx`.
 */

const CONTENT_REL = 'src/content'
const CONTENT_DIR = path.join(process.cwd(), CONTENT_REL)
const OUTPUT_PATH = path.join(process.cwd(), 'src/server/markdown/contentDates.generated.json')

/**
 * Committer date (YYYY-MM-DD) of the last commit to touch a file, or null.
 *
 * Per-file `git log -1` is authoritative: it follows git's history
 * simplification, so it correctly reports merge commits that landed a change —
 * which a bulk `--name-only` pass silently drops (merges list no files).
 */
async function gitDateForFile(key: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['log', '-1', '--format=%cs', '--', `${CONTENT_REL}/${key}`],
      { encoding: 'utf8' },
    )
    return stdout.trim() || null
  } catch {
    return null
  }
}

/** Map `fn` over `items` with at most `limit` in flight at once. */
async function mapPool<T, R>(
  items: T[],
  limit: number,
  // eslint-disable-next-line no-unused-vars
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

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

  // Re-check: if still shallow, every per-file date would be the deploy date.
  try {
    return !isShallowRepo()
  } catch {
    return false
  }
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

async function main() {
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

  console.log(`Found ${total} content file(s) under ${CONTENT_REL} (concurrency ${CONCURRENCY})`)

  const dates = await mapPool(files, CONCURRENCY, async (key, index) => {
    const prefix = `[${index + 1}/${total}]`
    const date = await gitDateForFile(key)
    if (date) {
      console.log(`${prefix} Dated ${key} → ${date}`)
    } else {
      console.warn(`${prefix} No git date for ${key} (last_updated omitted)`)
    }
    return date
  })

  const manifest: Record<string, string> = {}
  let missing = 0
  files.forEach((key, i) => {
    if (dates[i]) manifest[key] = dates[i] as string
    else missing++
  })

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Wrote ${OUTPUT_PATH}`)
  console.log(
    `Done! Dated ${Object.keys(manifest).length} content file(s)` +
      (missing ? `; ${missing} without a git date (last_updated omitted for those).` : '.'),
  )
}

main().catch((error) => {
  console.error('Failed to generate content dates:', error)
  process.exit(1)
})
