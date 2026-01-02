import createMdx from '@next/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeShiki from '@shikijs/rehype'
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
        source: '/feed',
        destination: '/',
        permanent: true,
      },
      {
        source: '/docsassets/images/tiptap-logo.png',
        destination: '/assets/images/tiptap-logo.png',
        permanent: true,
      },
      {
        source: '/docs/resources/pricing',
        destination: '/pricing',
        permanent: true,
      },
      {
        source: '/editor/install',
        destination: '/editor/getting-started/install',
        permanent: true,
      },
      {
        source: '/editor/markdown/getting-started',
        destination: '/editor/markdown/getting-started/installation',
        permanent: true,
      },
      {
        source: '/editor/markdown/advanced-usage',
        destination: '/editor/markdown/advanced-usage/custom-tokenizer',
        permanent: true,
      },
      {
        source: '/editor/markdown/guides',
        destination: '/editor/markdown/guides/integrate-markdown-in-your-extension',
        permanent: true,
      },
      {
        source: '/editor/markdown/api',
        destination: '/editor/markdown/api/editor',
        permanent: true,
      },
      {
        source: '/editor/extensions/functionality/mathematics',
        destination: '/editor/extensions/nodes/mathematics',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/agent/tiptap-cloud',
        destination: '/content-ai/capabilities/agent/use-with-content-ai-cloud',
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
        permanent: true,
      },
      {
        source: '/content-ai/custom-llms/integrate',
        destination: '/content-ai/content-ai/custom-llms',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/generation',
        destination: '/content-ai/capabilities/generation/overview',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/generation/text-generation',
        destination: '/content-ai/capabilities/generation/text-generation/built-in-commands',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/suggestion',
        destination: '/content-ai/capabilities/suggestion/overview',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/suggestion',
        destination: '/content-ai/capabilities/suggestion/overview',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/suggestion/features',
        destination: '/content-ai/capabilities/suggestion/features/define-rules',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/changes',
        destination: '/content-ai/capabilities/changes/overview',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/changes/features',
        destination: '/content-ai/capabilities/changes/features/review-changes',
        permanent: true,
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
        destination: '/content-ai/capabilities/agent/features/state',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/agent/configure',
        destination: '/content-ai/capabilities/agent/configure/options',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/agent/custom-llms',
        destination: '/content-ai/capabilities/agent/custom-llms/overview',
        permanent: true,
      },
      {
        source: '/collaboration/documents/conversion',
        destination: '/conversion/getting-started/overview',
        permanent: true,
      },
      {
        source: '/collaboration/documents/history',
        destination: '/collaboration/documents/snapshot',
        permanent: true,
      },
      {
        source: '/ui-components/node-components',
        destination: '/ui-components/node-components/blockquote-node',
        permanent: true,
      },
      {
        source: '/ui-components/utils-components',
        destination: '/ui-components/utils-components/floating-element',
        permanent: true,
      },
      {
        source: '/ui-components/components',
        destination: '/ui-components/components/ai-ask-button',
        permanent: true,
      },
      {
        source: '/ui-components/primitives',
        destination: '/ui-components/primitives/avatar',
        permanent: true,
      },
      {
        source: '/ui-components/getting-started',
        destination: '/ui-components/getting-started/overview',
        permanent: true,
      },
      {
        source: '/ui-components/components/highlight-popover',
        destination: '/ui-components/components/color-highlight-popover',
        permanent: true,
      },
      {
        source: '/ui-components/components/node-button',
        destination: '/ui-components/components/blockquote-button',
        permanent: true,
      },
      // The redirects below are temporary and should be moved to the reverse proxy
      // TODO: add these redirects to the reverse proxy
      {
        source: '/content-ai/capabilities/agent/features/state-management',
        destination: '/content-ai/capabilities/agent/features/state',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/agent/features/runs',
        destination: '/content-ai/capabilities/agent/features/lifecycle',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/agent/features/reading-the-document',
        destination: '/content-ai/capabilities/agent/features/large-documents',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/agent/features/add-context',
        destination: '/content-ai/capabilities/agent/features/context',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/agent/features/review',
        destination: '/content-ai/capabilities/agent/review',
        permanent: true,
      },
      {
        source: '/editor/api/extensions/collaboration-caret',
        destination: '/editor/extensions/functionality/collaboration-caret',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit',
        destination: '/content-ai/capabilities/ai-toolkit/overview',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit/guides',
        destination: '/content-ai/capabilities/ai-toolkit/guides/ai-agent-chatbot',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit/primitives',
        destination: '/content-ai/capabilities/ai-toolkit/primitives/execute-tool',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit/tools',
        destination: '/content-ai/capabilities/ai-toolkit/tools/available-tools',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit/changelog',
        destination: '/content-ai/capabilities/ai-toolkit/changelog/ai-toolkit',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit/advanced-guides',
        destination: '/content-ai/capabilities/ai-toolkit/advanced-guides/ai-engineering',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit/guides/multi-document',
        destination: '/content-ai/capabilities/ai-toolkit/advanced-guides/multi-document',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit/guides/ai-engineering',
        destination: '/content-ai/capabilities/ai-toolkit/advanced-guides/ai-engineering',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/server-ai-toolkit',
        destination: '/content-ai/capabilities/server-ai-toolkit/overview',
        permanent: true,
      },
      {
        source: '/hocuspocus/introduction',
        destination: '/hocuspocus/getting-started/overview',
        permanent: true,
      },
      {
        source: '/editor/ai/advanced-usage/custom-llm',
        destination: '/content-ai/capabilities/generation/overview',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit/advanced-guides/proofreader',
        destination: '/content-ai/capabilities/ai-toolkit/workflows/proofreader',
        permanent: true,
      },
      {
        source: '/content-ai/capabilities/ai-toolkit/guides/inline-edits',
        destination: '/content-ai/capabilities/ai-toolkit/workflows/insert-content',
        permanent: true,
      },
    ]
  },
}

const withMDX = createMdx({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: 'github-dark-high-contrast',
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
