import createMdx from '@next/mdx'
import { redirects } from './src/server/redirects.mjs'

const svgComponentPattern = /^src\/assets\/icons\/.*\.svg$/

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Content files are read at runtime via fs (markdown endpoint, llms.txt,
  // changelogs, and the page route). Node File Trace can't detect these dynamic
  // reads, so include them in the standalone output explicitly.
  outputFileTracingIncludes: {
    '/api/md/[...path]': [
      './src/content/**/*.mdx',
      './src/content/resources/changelog/_data/*.json',
      './src/server/markdown/contentDates.generated.json',
    ],
    '/llms.txt': ['./src/content/**/*.mdx'],
    '/[...markdownPath]': ['./src/content/**/*.mdx'],
  },
  turbopack: {
    rules: {
      '*.svg': {
        condition: {
          all: [{ not: 'foreign' }, { path: svgComponentPattern }],
        },
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: { unoptimized: true },
  basePath: process.env.BASE_PATH ?? '',
  async headers() {
    const commitSha = process.env.GIT_COMMIT_SHA || 'unknown'
    const shortSha = commitSha.substring(0, 7)
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Git-Commit', value: shortSha },
          { key: 'X-Git-Branch', value: process.env.GIT_COMMIT_REF_NAME || 'unknown' },
        ],
      },
    ]
  },
  async redirects() {
    // Under a base path, as on Vercel previews, the bare domain leads to the docs
    const root = process.env.BASE_PATH
      ? [{ source: '/', destination: process.env.BASE_PATH, basePath: false, permanent: false }]
      : []
    return [...root, ...redirects]
  },
}

// Turning ```mermaid into SVG at build time needs a browser: Alpine's Chromium in Docker,
// Playwright's locally. Vercel's preview builds have none, so there the diagrams stay
// mermaid code and MermaidDiagrams draws them in the reader's browser.
const mermaidAtBuild = !!process.env.MERMAID_CHROMIUM_PATH || !process.env.VERCEL

const withMDX = createMdx({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-mdx-frontmatter', 'remark-gfm'],
    rehypePlugins: [
      // ```mermaid blocks become SVG, before Shiki would highlight them as code.
      // A browser starts only for a page with a diagram.
      [
        'rehype-mermaid',
        {
          strategy: mermaidAtBuild ? 'inline-svg' : 'pre-mermaid',
          ...(process.env.MERMAID_CHROMIUM_PATH
            ? { launchOptions: { executablePath: process.env.MERMAID_CHROMIUM_PATH } }
            : {}),
        },
      ],
      [
        '@shikijs/rehype',
        {
          theme: 'github-dark-high-contrast',
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
