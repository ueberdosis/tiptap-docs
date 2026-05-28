import createMdx from '@next/mdx'
import { redirects } from './src/server/redirects.mjs'

const svgComponentPattern = /^src\/assets\/icons\/.*\.svg$/

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Raw `.mdx` files are read at runtime via fs (markdown endpoint, llms.txt,
  // and the page route). Node File Trace can't detect these dynamic reads, so
  // include the whole content tree in the standalone output explicitly.
  outputFileTracingIncludes: {
    '/api/md/[...path]': ['./src/content/**/*.mdx'],
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
    return redirects
  },
}

const withMDX = createMdx({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-mdx-frontmatter', 'remark-gfm'],
    rehypePlugins: [
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
