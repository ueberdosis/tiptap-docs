import type { VersionName } from '@/lib/versions';

/** Demo base URLs per docs version. */
const demoUrls = {
  latest: {
    demo: process.env.NEXT_PUBLIC_DEMO_URL ?? 'https://embed.tiptap.dev/preview',
    pro: process.env.NEXT_PUBLIC_DEMO_URL_PRO ?? 'https://embed-pro.tiptap.dev/preview',
  },
  v2: {
    demo: process.env.NEXT_PUBLIC_DEMO_URL_V2 ?? 'https://v2--tiptap-embed.netlify.app/preview',
    pro: process.env.NEXT_PUBLIC_DEMO_URL_PRO_V2 ?? 'https://v2--tiptap-pro.netlify.app/preview',
  },
};

/** Returns the demo base URL of a docs version. */
export function getDemoBaseUrl(version: VersionName, isPro?: boolean) {
  const urls = demoUrls[version];
  return isPro ? urls.pro : urls.demo;
}
