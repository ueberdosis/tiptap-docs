import createMdx from '@next/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: { unoptimized: true },
  basePath: process.env.BASE_PATH ?? '',
  async redirects() {
    return [
      {
        source: '/content-ai/capabilities/text-generation',
        destination: '/content-ai/capabilities/text-generation/built-in-commands',
        permanent: true,
      },
      {
        source: '/conversion/import-export/odt',
        destination: '/conversion/import-export/odt/editor-extensions',
        permanent: true,
      },
      {
        source: '/conversion/import-export/markdown',
        destination: '/conversion/import-export/markdown/editor-extensions',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/generation',
        destination: '/content-ai/capabilities/generation/overview',
        permanent: false,
      },
      {
        source: '/content-ai/capabilities/generation',
        destination: '/content-ai/capabilities/generation/overview',
        permanent: false,
      },
      {
        source: '/content-ai/capabilities/generation/text-generation',
        destination: '/content-ai/capabilities/generation/text-generation/built-in-commands',
        permanent: false,
      },
      {
        source: '/content-ai/capabilities/suggestion',
        destination: '/content-ai/capabilities/suggestion/overview',
        permanent: false,
      },
      {
        source: '/content-ai/capabilities/suggestion',
        destination: '/content-ai/capabilities/suggestion/overview',
        permanent: false,
      },
      {
        source: '/content-ai/capabilities/suggestion/features',
        destination: '/content-ai/capabilities/suggestion/features/define-rules',
        permanent: false,
      },
      {
        source: '/content-ai/capabilities/changes',
        destination: '/content-ai/capabilities/changes/overview',
        permanent: false,
      },
      {
        source: '/content-ai/capabilities/changes/features',
        destination: '/content-ai/capabilities/changes/features/review-changes',
        permanent: false,
      },
      {
        source: '/content-ai/capabilities/text-generation',
        destination: '/content-ai/capabilities/generation/overview',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/agent',
        destination: '/content-ai/capabilities/agent/overview',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/agent/features',
        destination: '/content-ai/capabilities/agent/features/state-management',
        permanent: true,
      },
      {
        source: '/collaboration/documents/conversion',
        destination: '/conversion/getting-started/overview',
        permanent: true,
      },
      {
        source: '/ui-components/node-components',
        destination: '/ui-components/node-components/code-block-node',
        permanent: false,
      },
      {
        source: '/ui-components/components',
        destination: '/ui-components/components/heading-button',
        permanent: false,
      },
      {
        source: '/ui-components/primitives',
        destination: '/ui-components/primitives/avatar',
        permanent: false,
      },
      {
        source: '/ui-components/getting-started',
        destination: '/ui-components/getting-started/overview',
        permanent: false,
      },
    ]
  },
}

const withMDX = createMdx({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
})

export default withMDX(nextConfig)
