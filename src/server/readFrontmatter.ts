import { open } from 'fs/promises'
import { StringDecoder } from 'string_decoder'
import frontmatter from 'front-matter'
import type { PageFrontmatter } from '../types'

// Stop at the YAML boundary so list pages never retain the MDX body.
export async function readFrontmatter(filePath: string): Promise<PageFrontmatter> {
  const file = await open(filePath, 'r')
  const buffer = Buffer.alloc(4096)
  const decoder = new StringDecoder('utf8')
  let header = ''
  let totalBytes = 0

  try {
    while (true) {
      const { bytesRead } = await file.read(buffer, 0, buffer.length, null)
      if (bytesRead === 0) {
        return frontmatter<PageFrontmatter>(header + decoder.end()).attributes
      }

      totalBytes += bytesRead
      header += decoder.write(buffer.subarray(0, bytesRead))
      if (!/^\ufeff?(---|= yaml =)(?:\r?\n|$)/.test(header)) {
        return {}
      }

      // A delimiter at the chunk boundary may still be part of an unfinished line.
      const completeLines = header.slice(0, header.lastIndexOf('\n') + 1)
      if (frontmatter.test(completeLines)) {
        return frontmatter<PageFrontmatter>(completeLines).attributes
      }
      if (totalBytes >= 65_536) {
        throw new Error(`Frontmatter exceeds 64 KiB in ${filePath}`)
      }
    }
  } finally {
    await file.close()
  }
}
