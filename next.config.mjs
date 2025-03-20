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
        source: '/content-ai/extensions/ai',
        destination: '/content-ai/extensions/ai/getting-started/overview',
        permanent: false,
      },
      {
        source: '/content-ai/extensions/ai/getting-started',
        destination: '/content-ai/extensions/ai/getting-started/overview',
        permanent: false,
      },
      {
        source: '/content-ai/extensions/ai/capabilities/text-generation',
        destination: '/content-ai/extensions/ai/capabilities/text-generation/built-in-commands',
        permanent: false,
      },
      {
        source: '/content-ai/extensions/ai-suggestion',
        destination: '/content-ai/extensions/ai-suggestion/overview',
        permanent: false,
      },
      {
        source: '/content-ai/extensions/ai-suggestion',
        destination: '/content-ai/extensions/ai-suggestion/overview',
        permanent: false,
      },
      {
        source: '/content-ai/extensions/ai-suggestion/features',
        destination: '/content-ai/extensions/ai-suggestion/features/define-rules',
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
