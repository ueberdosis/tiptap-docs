import type { VersionData } from '@/types'

export const BASE_PATH = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || ''
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'
export const FULL_DOMAIN = `${DOMAIN}${BASE_PATH}`

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || null
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'

export const VERSIONS: Array<VersionData> = [
  {
    version: '1.x',
    isExternal: true,
    url: 'https://v1.tiptap.dev',
    isLegacy: true,
  },
  {
    version: '2.x',
    key: '2.x',
    demoUrls: {
      free: 'https://embed.tiptap.dev',
      pro: 'https://embed-pro.tiptap.dev',
    },
  },
  {
    version: '3.x',
    key: '3.x',
    isBeta: true,
    demoUrls: {
      free: 'https://next--tiptap-embed.netlify.app',
      pro: 'https://next--tiptap-pro.netlify.app',
    },
  },
]
