import fs from 'fs'
import path from 'path'
import { readFrontmatterSync } from './readFrontmatter'
import { Plan, planFromTags } from '@/content/plans'

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

/** The MDX file of a route, such as `/comments/getting-started/overview`. */
function fileForRoute(route: string): string | undefined {
  const base = path.join(CONTENT_DIR, route === '/' ? 'index' : route)
  return [`${base}.mdx`, path.join(base, 'index.mdx')].find((file) => fs.existsSync(file))
}

/** The plan a page's own frontmatter tags name, if it names one. */
export function pagePlan(route: string): Plan | undefined {
  const file = fileForRoute(route)
  if (!file) return undefined
  const tags = readFrontmatterSync(file).tags ?? []
  return planFromTags(tags.map((tag) => tag.type))
}

/** A page's own title from its frontmatter, such as "Import .docx in your editor". */
export function pageTitle(route: string): string | undefined {
  const file = fileForRoute(route.split('#')[0])
  return file ? readFrontmatterSync(file).title : undefined
}
