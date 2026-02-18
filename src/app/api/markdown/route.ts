import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { processRawMdx } from '@/server/mdxToMarkdown'
import { FULL_DOMAIN } from '@/utils/constants'

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

/**
 * Resolve a URL path to an MDX file path on disk.
 * Mirrors the resolution logic in [...markdownPath]/page.tsx
 */
function resolveMdxFile(urlPath: string): string | null {
  // Handle root/home page
  if (!urlPath || urlPath === '') {
    const indexPath = path.join(CONTENT_DIR, 'index.mdx')
    if (fs.existsSync(indexPath)) {
      return indexPath
    }
    return null
  }

  // Try direct path: {urlPath}.mdx
  const directPath = path.join(CONTENT_DIR, `${urlPath}.mdx`)
  if (fs.existsSync(directPath)) {
    return directPath
  }

  // Try index path: {urlPath}/index.mdx
  const indexPath = path.join(CONTENT_DIR, urlPath, 'index.mdx')
  if (fs.existsSync(indexPath)) {
    return indexPath
  }

  return null
}

export async function GET(request: NextRequest) {
  // Path is passed via header from middleware, or via query param for direct access
  const urlPath =
    request.headers.get('x-markdown-path') ??
    request.nextUrl.searchParams.get('path') ??
    ''

  // Prevent path traversal
  const normalizedPath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  if (normalizedPath.includes('..')) {
    return new Response('Invalid path', { status: 400 })
  }

  const mdxFilePath = resolveMdxFile(normalizedPath)

  if (!mdxFilePath) {
    return new Response('# Page not found\n\nThe requested documentation page does not exist.\n', {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  }

  // Defense in depth: verify resolved path stays within content directory
  const realMdxPath = fs.realpathSync(mdxFilePath)
  const realContentDir = fs.realpathSync(CONTENT_DIR)
  if (!realMdxPath.startsWith(realContentDir)) {
    return new Response('Invalid path', { status: 400 })
  }

  try {
    const rawContent = fs.readFileSync(mdxFilePath, 'utf-8')
    const { markdown, title, description } = processRawMdx(rawContent)

    const parts: string[] = []

    if (title) {
      parts.push(`# ${title}`)
    }
    if (description) {
      parts.push(`> ${description}`)
    }
    if (parts.length > 0) {
      parts.push('')
    }
    parts.push(markdown)

    // Source URL footer
    const sourceUrl = urlPath ? `/${urlPath}` : '/'
    parts.push('')
    parts.push('---')
    parts.push(`Source: ${FULL_DOMAIN}${sourceUrl}`)

    const responseBody = parts.join('\n')

    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Error processing MDX file:', mdxFilePath, error)
    return new Response('# Error\n\nAn error occurred processing this page.\n', {
      status: 500,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  }
}
