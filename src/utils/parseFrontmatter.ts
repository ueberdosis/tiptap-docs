import { parse as parseYaml } from 'yaml'

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function parseFrontmatter<T extends Record<string, unknown> = Record<string, unknown>>(
  content: string,
): { attributes: T; body: string } {
  const match = content.match(FRONTMATTER_RE)
  if (!match) {
    return { attributes: {} as T, body: content }
  }

  const [, frontmatter, body = ''] = match
  const attributes = frontmatter.trim() ? (parseYaml(frontmatter) as T) : ({} as T)

  return { attributes, body }
}
