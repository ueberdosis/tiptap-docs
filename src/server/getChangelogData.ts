import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'src/content/resources/changelog/_data')

export type ChangelogData = {
  packageName: string
  slug: string
  content: string
}

export type ChangelogIndexEntry = {
  slug: string
  packageName: string
}

export function getChangelogData(slug: string): ChangelogData | null {
  // Validate slug to prevent directory traversal attacks
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  const filePath = path.join(DATA_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function getChangelogIndex(): ChangelogIndexEntry[] {
  const filePath = path.join(DATA_DIR, 'index.json')
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}
