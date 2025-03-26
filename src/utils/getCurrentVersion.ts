// matches digits + an .x (for example 2.x, 3.x, 4.x, etc.)
const VERSION_REGEX = /\d+\.x/

export const getCurrentVersion = (currentPath: string = '/') => {
  const firstPart = currentPath.split('/')[1]
  return firstPart.match(VERSION_REGEX)?.[0] ?? null
}
