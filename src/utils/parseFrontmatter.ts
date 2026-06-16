import { parse as parseYaml } from 'yaml'

const FRONTMATTER_PATTERN =
  /^(\ufeff?)(= yaml =|---)\r?\n([\s\S]*?)\r?\n(?:\2|\.\.\.)\s*(?:\r?\n)?/

export function parseFrontmatter<T extends Record<string, unknown> = Record<string, unknown>>(
  content: string,
): { attributes: T; body: string } {
  const match = FRONTMATTER_PATTERN.exec(content)

  if (!match) {
    return { attributes: {} as T, body: content }
  }

  const yamlContent = match[3].trim()
  const attributes = (yamlContent ? parseYaml(yamlContent) : {}) as T
  const body = content.slice(match[0].length)

  return { attributes, body }
}
