import path from 'path'
import type { PageFrontmatter } from '@/types'
import type { ExternalVersion, InternalVersion, VersionData } from '@/types'

export const getImportPathForVersion = (version: string, ...incPath: string[]) =>
  path.join(process.cwd(), 'src/content', version, ...incPath)

export const importMdxFromPath = async (version: string, incPath: string) => {
  return (await import(`@/content/${version}/${incPath}`)) as {
    default: () => JSX.Element
    frontmatter?: PageFrontmatter
  }
}

/**
 * Find the most recent version that is not a beta version
 * @param versions The list of versions to search
 */
export const getRecentVersion = (versions: Array<VersionData>) => {
  return versions.filter((version) => !version.isBeta).at(-1)
}

/**
 * Finds the most recent beta version
 * @param versions The list of versions to search
 * @returns The most recent beta version
 */
export const getRecentBetaVersion = (versions: Array<VersionData>) => {
  return versions.filter((version) => version.isBeta).at(-1)
}

/**
 * Typeguard to check if a version is external by checking if it has a url
 * @param version The version to check
 * @returns boolean
 */
export const isExternalVersion = (version: VersionData): version is ExternalVersion => {
  return !!(version as ExternalVersion).url
}

/**
 * Typeguard to check if a version is internal by checking if it has a key
 * @param version The version to check
 * @returns boolean
 */
export const isInternalVersion = (version: VersionData): version is InternalVersion => {
  return !!(version as InternalVersion).key
}
