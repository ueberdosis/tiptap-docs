export const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL ?? 'https://embed.tiptap.dev/preview'

export const PRO_DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL_PRO ?? 'https://embed-pro.tiptap.dev/preview'

export const BASE_PATH = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || ''
export const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'
export const FULL_DOMAIN = `${DOMAIN}${BASE_PATH}`

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || null
