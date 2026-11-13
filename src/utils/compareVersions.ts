// Shared by the changelog on the server and its filters in the browser

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
