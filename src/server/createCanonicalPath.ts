import { DOMAIN, BASE_PATH } from '@/utils/constants'

export const createCanonicalPath = (path: string[]) => {
  const urlPath = [BASE_PATH, ...path].join('/')
  const canonicalUrl = new URL(urlPath, DOMAIN)
  const href = canonicalUrl.href

  return href
}
