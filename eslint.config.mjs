import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const nextConfig = require('eslint-config-next')
const prettierConfig = require('eslint-config-prettier')
const mdxPlugin = require('eslint-plugin-mdx')
const prettierPlugin = require('eslint-plugin-prettier')

const config = [
  ...nextConfig,
  mdxPlugin.flat,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}'],
    rules: {
      'no-tabs': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
      'no-unused-vars': 'warn',
      'prefer-template': 'error',
      'import/order': 'error',
    },
  },
]

export default config
