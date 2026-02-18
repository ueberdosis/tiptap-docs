import fm from 'front-matter'

interface ProcessedMdx {
  title: string
  description: string
  markdown: string
}

/**
 * Process a raw MDX file string into clean markdown suitable for AI agents.
 *
 * 1. Parse and extract YAML frontmatter (title, description)
 * 2. Strip import statements
 * 3. Strip JSX blocks (both self-closing and multi-line)
 * 4. Strip JSX expression spacers like {' '}
 * 5. Clean up excessive whitespace
 */
export function processRawMdx(rawContent: string): ProcessedMdx {
  const { attributes, body } = fm<Record<string, any>>(rawContent)

  const title = attributes.title ?? ''
  const description = attributes.meta?.description ?? attributes.description ?? ''

  let processed = body

  // Strip import lines
  processed = processed.replace(/^import\s+.*$/gm, '')

  // Strip JSX expression spacers: {' '} on their own line
  processed = processed.replace(/^\{'\s*'\}\s*$/gm, '')

  // Strip export lines (e.g. export const meta = ...)
  processed = processed.replace(/^export\s+.*$/gm, '')

  // Strip self-closing JSX tags on a single line
  // e.g. <CodeDemo path="/Nodes/Image" />
  processed = processed.replace(/^[ \t]*<[A-Z][a-zA-Z.]*\b[^>]*\/>\s*$/gm, '')

  // Strip multi-line JSX blocks
  processed = stripJsxBlocks(processed)

  // Clean up excessive blank lines (3+ newlines -> 2)
  processed = processed.replace(/\n{3,}/g, '\n\n')

  // Trim leading/trailing whitespace
  processed = processed.trim()

  return { title, description, markdown: processed }
}

/**
 * Strip multi-line JSX blocks from markdown content.
 *
 * When we encounter a line starting with a JSX opening tag
 * (< followed by uppercase letter, or <div/<span), we track the
 * nesting depth and skip all lines until the block closes.
 *
 * Handles multi-line opening tags where attributes span multiple lines:
 *   <Section
 *     title="..."
 *   >
 *
 * Preserves:
 * - Standard markdown (headings, paragraphs, lists, code blocks, links)
 * - Fenced code blocks (``` ... ```) — never strips inside them
 */
function stripJsxBlocks(content: string): string {
  const lines = content.split('\n')
  const result: string[] = []

  let jsxDepth = 0
  let inCodeBlock = false
  // Track when we're inside an opening tag that spans multiple lines
  // e.g. <Section\n  title="..."\n>
  let inOpeningTag = false

  for (const line of lines) {
    const trimmed = line.trim()

    // Track fenced code blocks — never strip inside them
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        if (jsxDepth === 0 && !inOpeningTag) {
          result.push(line)
        }
        continue
      } else {
        inCodeBlock = false
        if (jsxDepth === 0 && !inOpeningTag) {
          result.push(line)
        }
        continue
      }
    }

    if (inCodeBlock) {
      if (jsxDepth === 0 && !inOpeningTag) {
        result.push(line)
      }
      continue
    }

    // If we're inside a multi-line opening tag, wait for closing >
    if (inOpeningTag) {
      if (/\/>[ \t]*$/.test(trimmed)) {
        // Self-closing end: <Section\n  ...\n/>
        inOpeningTag = false
        // Don't change depth — self-closing tag is net zero
      } else if (/>[ \t]*$/.test(trimmed)) {
        // Opening tag closed: now count it as +1
        inOpeningTag = false
        jsxDepth += 1
      }
      // Either way, skip this line (it's part of JSX)
      continue
    }

    // Check if this line starts a JSX tag (opening or closing)
    const jsxTagStart = /^[ \t]*<\/?([A-Z][a-zA-Z.]*|div|span)\b/.test(trimmed)

    if (jsxDepth === 0 && !jsxTagStart) {
      // Normal markdown line — keep it
      result.push(line)
      continue
    }

    // From here, either we're inside a JSX block (depth > 0) or this line starts JSX

    // Check for multi-line opening tag: <Component with no > on this line
    const isOpeningTagStart = /^[ \t]*<([A-Z][a-zA-Z.]*|div|span)\b/.test(trimmed)
    if (isOpeningTagStart && !/>/.test(trimmed)) {
      inOpeningTag = true
      if (jsxDepth === 0) {
        // Starting a new JSX block with multi-line tag
      }
      continue
    }

    // Self-closing tag on single line
    if (isOpeningTagStart && /\/>[ \t]*$/.test(trimmed)) {
      // Net zero depth change — just skip
      continue
    }

    // Count depth changes from complete tags on this line
    jsxDepth += countNetJsxDepth(trimmed)

    if (jsxDepth <= 0) {
      jsxDepth = 0
    }
  }

  return result.join('\n')
}

/**
 * Count the net JSX depth change for a line.
 * Opening tags: +1, closing tags: -1, self-closing: 0.
 */
function countNetJsxDepth(line: string): number {
  let depth = 0

  // Opening tags: <Component or <div (NOT self-closing, NOT closing)
  const openingTags = line.match(/<([A-Z][a-zA-Z.]*|div|span)\b[^>]*(?<!\/)>/g)
  if (openingTags) {
    depth += openingTags.length
  }

  // Closing tags: </Component> or </div>
  const closingTags = line.match(/<\/([A-Z][a-zA-Z.]*|div|span)\b[^>]*>/g)
  if (closingTags) {
    depth -= closingTags.length
  }

  return depth
}
