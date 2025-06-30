import fs from 'fs'
import path from 'path'

import type { SidebarConfig } from '@/types'

export async function importSidebarConfigFromMarkdownPath(markdownPath: string[]) {
  let importPath = ''
  let steppedSegments: string[] = []

  ;['', ...markdownPath].forEach((segment) => {
    steppedSegments.push(segment)

    const filePath = path.join(process.cwd(), 'src/content', ...steppedSegments, 'sidebar.ts')

    const fileExists = fs.existsSync(filePath)

    if (fileExists) {
      const isIndex = steppedSegments[steppedSegments.length - 1] === ''
      importPath = isIndex
        ? 'sidebar'
        : `${steppedSegments.filter((s) => s !== '').join('/')}/sidebar`
    }
  })

  if (!importPath) {
    return Promise.resolve({ sidebarConfig: undefined })
  }
  return import(`@/content/${importPath}`) as Promise<{
    sidebarConfig: SidebarConfig | undefined
  }>
}
