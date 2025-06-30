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
      importPath = isIndex
        ? 'sidebar'
        : `${steppedSegments.filter((s) => s !== '').join('/')}sidebar`
    }

    // remove last segment
    restSegments.pop()
  }

  return import(`@/content/${importPath}`)
}
