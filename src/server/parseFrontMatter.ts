import { parse } from 'yaml'

export function parseFrontMatter<T extends Record<string, unknown>>(
  content: string,
): { attributes: T; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  if (!match) {
    return { attributes: {} as T, body: content }
  }

  const attributes = (parse(match[1]) ?? {}) as T

  return { attributes, body: match[2] }
}
