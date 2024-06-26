import fg from 'fast-glob'

/**
 * Gets all content MDX files from the content directory via fast-glob
 */
export const getAllContent = async () => {
  const files = await fg('src/content/**/*.mdx')

  return files
}
