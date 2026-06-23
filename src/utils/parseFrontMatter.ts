import { parse as parseYaml } from 'yaml'

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export function parseFrontMatter<T extends Record<string, unknown> = Record<string, unknown>>(
  content: string,
): { attributes: T; body: string } {
  const match = content.match(FRONTMATTER_PATTERN)

  if (!match) {
    return { attributes: {} as T, body: content }
  }

  const attributes = (parseYaml(match[1]) ?? {}) as T

  return { attributes, body: match[2] }
}
