// eslint-plugin-mdx parses MDX with this config; it mirrors the remark
// plugins in next.config.mjs so frontmatter is read as YAML, not as JSX
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'

const config = {
  plugins: [remarkFrontmatter, remarkGfm],
}

export default config
