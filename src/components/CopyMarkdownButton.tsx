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
    const directPath = `${sanitizedSegments.join('/')}.mdx`
    const indexPath = `${sanitizedSegments.join('/')}/index.mdx`

    const contentDir = path.join(process.cwd(), 'src/content')

    // Resolve paths and validate they stay within contentDir
    const directFilePath = path.resolve(contentDir, directPath)
    const indexFilePath = path.resolve(contentDir, indexPath)

    // Security check: ensure resolved paths are within contentDir
    if (
      !isPathWithinContentDir(directFilePath, contentDir) ||
      !isPathWithinContentDir(indexFilePath, contentDir)
    ) {
      console.error('Path traversal attempt detected')
      return null
    }

    let filePath: string | null = null

    // Check for direct path first using async I/O
    try {
      await fs.access(directFilePath)
      filePath = directFilePath
    } catch {
      // Check for index path
      try {
        await fs.access(indexFilePath)
        filePath = indexFilePath
      } catch {
        // Neither file exists
        return null
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
