/**
 * Plain text from HTML or JSX markup. A tag runs from `<` to the next `>`, unless
 * another `<` opens first; tags go, and so does any `<` or `>` outside one, so the
 * result can't open a tag of its own.
 */
export function stripTags(value: string): string {
  let text = ''
  for (let i = 0; i < value.length; i++) {
    const char = value[i]
    if (char === '<') {
      const end = value.indexOf('>', i + 1)
      const next = value.indexOf('<', i + 1)
      if (end !== -1 && (next === -1 || end < next)) i = end
    } else if (char !== '>') {
      text += char
    }
  }
  return text
}
