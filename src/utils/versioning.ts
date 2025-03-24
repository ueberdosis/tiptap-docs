import path from 'path'
import type { PageFrontmatter } from '@/types'

export const getImportPathForVersion = (version: string, ...incPath: string[]) =>
  path.join(process.cwd(), 'src/content', version, ...incPath)

export const importMdxFromPath = async (version: string, incPath: string) => {
  return (await import(`@/content/${version}/${incPath}`)) as {
    default: () => JSX.Element
    frontmatter?: PageFrontmatter
  }
}