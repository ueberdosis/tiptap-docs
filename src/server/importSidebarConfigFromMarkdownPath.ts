import fs from 'fs'
import path from 'path'

import type { SidebarConfig } from '@/types'

export async function importSidebarConfigFromMarkdownPath(markdownPath: string[]): Promise<{
  sidebarConfig: SidebarConfig | undefined
}> {
  let importPath = ''
  let steppedSegments: string[] = []

  const restSegments = ['', ...markdownPath]

  while (!importPath && restSegments.length > 0) {
    const fullPath = path.join(process.cwd(), 'src/content', ...restSegments, 'sidebar.ts')
    const fileExists = fs.existsSync(fullPath)

    if (fileExists) {
      const isIndex = steppedSegments[steppedSegments.length - 1] === ''
      const path = restSegments.join('/')

      importPath = isIndex ? 'sidebar' : `${path}/sidebar`
    }

    // remove last segment
    restSegments.pop()
  }

  // if the importPath starts with a slash, remove it
  // as import statements do not support leading slashes
  if (importPath.startsWith('/')) {
    importPath = importPath.slice(1)
  }

  return import(`@/content/${importPath}`)
}
