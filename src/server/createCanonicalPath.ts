import { FULL_DOMAIN } from '@/utils/constants'

export const createCanonicalPath = (path: string[]) => {
  const canonicalPath = `${FULL_DOMAIN}/${path.join('/')}`
  return canonicalPath
}
