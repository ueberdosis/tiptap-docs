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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isChangelogData(value: unknown): value is ChangelogData {
  return (
    isRecord(value) &&
    typeof value.packageName === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.content === 'string'
  )
}

function isChangelogIndexEntry(value: unknown): value is ChangelogIndexEntry {
  return isRecord(value) && typeof value.slug === 'string' && typeof value.packageName === 'string'
}

function readJsonFile(filePath: string): unknown | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (error) {
    console.error(`Failed to read changelog data from ${filePath}:`, error)
    return null
  }
}

export function getChangelogData(slug: string): ChangelogData | null {
  // Validate slug to prevent directory traversal attacks
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  const filePath = path.join(DATA_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null

  const data = readJsonFile(filePath)

  return isChangelogData(data) ? data : null
}

export function getChangelogIndex(): ChangelogIndexEntry[] {
  const filePath = path.join(DATA_DIR, 'index.json')
  if (!fs.existsSync(filePath)) return []

  const data = readJsonFile(filePath)

  return Array.isArray(data) ? data.filter(isChangelogIndexEntry) : []
}
