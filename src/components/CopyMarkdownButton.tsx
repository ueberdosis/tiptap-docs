import fs from 'fs/promises'
import path from 'path'
import { CopyMarkdownButtonClient } from './CopyMarkdownButton.client'

export type CopyMarkdownButtonProps = {
  markdownPath: string[]
  className?: string
}

// Helper function to sanitize path segments
const sanitizePathSegment = (segment: string): string => {
  // Remove any path separators and dangerous characters
  return segment.replace(/[\/\\]/g, '').replace(/\.{2,}/g, '')
}

// Helper function to validate that a resolved path is within the content directory
const isPathWithinContentDir = (resolvedPath: string, contentDir: string): boolean => {
  const normalizedResolved = path.normalize(resolvedPath)
  const normalizedContentDir = path.normalize(contentDir)
  return (
    normalizedResolved.startsWith(normalizedContentDir + path.sep) ||
    normalizedResolved === normalizedContentDir
  )
}

export const CopyMarkdownButton = async ({ markdownPath, className }: CopyMarkdownButtonProps) => {
  try {
    // Sanitize path segments to prevent directory traversal
    const sanitizedSegments = markdownPath.map(sanitizePathSegment)
    const contentDir = path.join(process.cwd(), 'src/content')
    const basePath = path.join(contentDir, ...sanitizedSegments)
    const directFilePath = `${basePath}.mdx`
    const indexFilePath = path.join(basePath, 'index.mdx')

    let filePath: string | null = null

    // Try direct file path first
    const resolvedDirectFilePath = path.resolve(directFilePath)
    if (isPathWithinContentDir(resolvedDirectFilePath, contentDir)) {
      try {
        await fs.access(resolvedDirectFilePath)
        filePath = resolvedDirectFilePath
      } catch {
        // Not found, try index file path
      }
    }

    if (!filePath) {
      const resolvedIndexFilePath = path.resolve(indexFilePath)
      if (isPathWithinContentDir(resolvedIndexFilePath, contentDir)) {
        try {
          await fs.access(resolvedIndexFilePath)
          filePath = resolvedIndexFilePath
        } catch {
          // Not found
        }
      }
    }

    if (!filePath) {
      return null
    }

    // Read file content asynchronously
    const content = await fs.readFile(filePath, 'utf-8')

    return <CopyMarkdownButtonClient content={content} className={className} />
  } catch (error) {
    console.error('Error reading markdown file:', error)
    return null
  }
}
