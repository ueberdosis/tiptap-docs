'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Draws the ```mermaid blocks that a build without a browser left as code, as on
 * Vercel previews. Elsewhere they are SVG already, and mermaid is never loaded.
 */
export function MermaidDiagrams() {
  const pathname = usePathname()
  useEffect(() => {
    const blocks = [...document.querySelectorAll<HTMLElement>('pre.mermaid:not([data-processed])')]
    if (!blocks.length) return
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false })
      mermaid.run({ nodes: blocks })
    })
  }, [pathname])
  return null
}
