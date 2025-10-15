import fs from 'fs'
import path from 'path'
import { CopyMarkdownButtonClient } from './CopyMarkdownButton.client'

export type CopyMarkdownButtonProps = {
  markdownPath: string[]
  className?: string
}

export const CopyMarkdownButton = ({ markdownPath, className }: CopyMarkdownButtonProps) => {
  try {
    const pathArray = markdownPath
    const directPath = `${pathArray.join('/')}.mdx`
    const indexPath = `${pathArray.join('/')}/index.mdx`

    const contentDir = path.join(process.cwd(), 'src/content')
    const directFilePath = path.join(contentDir, directPath)
    const indexFilePath = path.join(contentDir, indexPath)

    let filePath: string | null = null

    // Check for direct path first
    if (fs.existsSync(directFilePath)) {
      filePath = directFilePath
    }
    // Then check for index path
    else if (fs.existsSync(indexFilePath)) {
      filePath = indexFilePath
    }

    if (!filePath) {
      return null
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    return <CopyMarkdownButtonClient content={content} className={className} />
  } catch (error) {
    console.error('Error reading markdown file:', error)
    return null
  }
}
