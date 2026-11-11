/**
 * Whether the page is `href` or lies below it. An entry that only folds open
 * (`href: ''`) never matches. With `listed`, a page that has its own entry only
 * matches that entry.
 */
export function isAtOrBelow(pathname: string, href: string, listed?: Set<string>): boolean {
  if (href === '') return false
  if (pathname === href) return true
  if (href === '/' || listed?.has(pathname)) return false
  return pathname.startsWith(`${href}/`)
}
