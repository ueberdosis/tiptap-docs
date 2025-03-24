export const getCurrentVersion = (currentPath: string = '/') => {
  const firstPart = currentPath.split('/')[1]
  return firstPart.match(/^v\d+$/) ? firstPart : false
}
