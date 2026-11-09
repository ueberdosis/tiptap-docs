import fs from 'fs'
import path from 'path'
import { readFrontmatterSync } from './readFrontmatter'
import { Plan, Status, planFromTags, statusFromTags } from '@/content/plans'

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

/** The MDX file of a route, such as `/comments/getting-started/overview`. */
function fileForRoute(route: string): string | undefined {
  const base = path.join(CONTENT_DIR, route === '/' ? 'index' : route)
  return [`${base}.mdx`, path.join(base, 'index.mdx')].find((file) => fs.existsSync(file))
}

/** The plan and status a page's own frontmatter tags name, if they name them. */
export function pageLabels(route: string): { plan?: Plan; status?: Status } {
  const file = fileForRoute(route)
  if (!file) return {}
  const types = (readFrontmatterSync(file).tags ?? []).map((tag) => tag.type)
  return { plan: planFromTags(types), status: statusFromTags(types) }
}
