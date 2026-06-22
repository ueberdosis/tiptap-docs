import { parse as parseYaml } from 'yaml'

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function parseFrontmatter<T extends Record<string, unknown> = Record<string, unknown>>(
  content: string,
): { attributes: T; body: string } {
  const match = content.match(FRONTMATTER_PATTERN)
  if (!match) {
    return { attributes: {} as T, body: content }
  }

  const attributes = (parseYaml(match[1]) ?? {}) as T
  const body = content.slice(match[0].length)

  return { attributes, body }
}
