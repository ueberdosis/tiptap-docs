import path from 'path'
import fs from 'fs'
import { DOMAIN, BASE_PATH, VERSIONS } from '@/utils/constants'
import { getRecentVersion } from '@/utils/versioning'

function checkIfFileExistsForDefaultVersion(incPath: string[]) {
  const defaultVersion = getRecentVersion(VERSIONS)?.version
  if (!defaultVersion) {
    return false
  }

  const filepath = path.join(process.cwd(), 'src/content', defaultVersion, incPath.join('/'))
  return fs.existsSync(`${filepath}/index.mdx`) || fs.existsSync(`${filepath}.mdx`)
}

export const createCanonicalUrl = (path: string[], version?: string) => {
  const hasDefaultLink = checkIfFileExistsForDefaultVersion(path)

  if (version && !hasDefaultLink) {
    path.unshift(version)
  }
  const urlPath = [BASE_PATH, ...path].join('/')
  const canonicalUrl = new URL(urlPath, DOMAIN)
  const href = canonicalUrl.href

  return href
}
