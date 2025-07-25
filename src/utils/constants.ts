import type { CTABarOptions, VersionData } from '@/types'

export const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL ?? 'https://embed.tiptap.dev/preview'

export const PRO_DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL_PRO ?? 'https://embed-pro.tiptap.dev/preview'

export const BASE_PATH = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || ''
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'
export const FULL_DOMAIN = `${DOMAIN}${BASE_PATH}`
export const IS_NEXT = process.env.NEXT_PUBLIC_NEXT === 'true' ? true : false

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || null
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'

export const CURRENT_VERSION = '3.x'

export const VERSIONS: Array<VersionData> = [
  {
    version: '3.x',
    url: 'https://tiptap.dev/docs',
  },
  {
    version: '2.x',
    url: 'https://v2.tiptap.dev/docs',
  },
  {
    version: '1.x',
    isLegacy: true,
    url: 'https://v1.tiptap.dev/',
  },
]

export const CTA_BAR: CTABarOptions | null = {
  text: "Find out what's new in Tiptap Editor 3.0",
  url: '/resources/whats-new',
}
