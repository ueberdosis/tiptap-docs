import { createMDX } from 'fumadocs-mdx/next';
import { appRedirects } from './src/lib/app-redirects.mjs';
import { isProductionSite, legacyRobots, previewRobots } from './src/lib/shared.ts';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // On tiptap.dev only `/docs/*` reaches this app, so its JS and CSS are served under `/docs/_next/`.
  assetPrefix: '/docs',
  images: { path: '/docs/_next/image' },
  async headers() {
    if (!isProductionSite) {
      return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: previewRobots }] }];
    }
    // Old versions, for example `/docs/v2`, and everything below them.
    return ['/docs/v:version(\\d+)', '/docs/v:version(\\d+)/:path*'].map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: legacyRobots }],
    }));
  },
  async redirects() {
    return [
      { source: '/', destination: '/docs', permanent: false },
      ...appRedirects(import.meta.dirname),
    ];
  },
};

export default withMDX(config);
