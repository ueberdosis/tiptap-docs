import { parse as parseYaml } from 'yaml'

const optionalByteOrderMark = '\ufeff?'
const pattern = `^(${optionalByteOrderMark}(= yaml =|---)$([\\s\\S]*?)^(?:\\2|\\.\\.\\.)\\s*$\\r?(?:\\n)?)`
const regex = new RegExp(pattern, 'm')

export type FrontmatterResult<T> = {
  attributes: T
  body: string
  bodyBegin: number
  frontmatter?: string
}

function computeLocation(match: RegExpExecArray, body: string): number {
  let line = 1
  let pos = body.indexOf('\n')
  const offset = match.index + match[0].length

  while (pos !== -1) {
    if (pos >= offset) {
      return line
    }
    line++
    pos = body.indexOf('\n', pos + 1)
  }

  return line
}

function parse<T>(string: string): FrontmatterResult<T> {
  const match = regex.exec(string)
  if (!match) {
    return {
      attributes: {} as T,
      body: string,
      bodyBegin: 1,
    }
  }

  const yaml = match[match.length - 1].replace(/^\s+|\s+$/g, '')
  const attributes = (parseYaml(yaml) ?? {}) as T
  const body = string.replace(match[0], '')
  const line = computeLocation(match, string)

  return {
    attributes,
    body,
    bodyBegin: line,
    frontmatter: yaml,
  }
}

export default function parseFrontmatter<T = Record<string, unknown>>(
  string?: string,
): FrontmatterResult<T> {
  const content = string ?? ''
  const lines = content.split(/(\r?\n)/)
  if (lines[0] && /= yaml =|---/.test(lines[0])) {
    return parse<T>(content)
  }

  return {
    attributes: {} as T,
    body: content,
    bodyBegin: 1,
  }
}

parseFrontmatter.test = (string?: string): boolean => {
  return regex.test(string ?? '')
}
