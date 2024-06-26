import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useToC = () => {
  const pathName = usePathname()
  const [headlines, setHeadlines] = useState<Array<HTMLHeadingElement>>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const mdxContent = document.querySelector('.mdx-content')
    const headlines = mdxContent?.querySelectorAll('h2')
    const headlineArray = Array.from(headlines || []).filter((headline) => !!headline.id)

    setHeadlines(headlineArray)

    const scrollObserver = () => {
      const scrollY = window.scrollY

      const activeHeadlines = headlineArray.filter((headline) => {
        const offsetTop = headline.offsetTop
        return offsetTop - 150 <= scrollY
      })

      const activeId = activeHeadlines[activeHeadlines.length - 1]?.id || null

      setActiveId(activeId)
    }

    scrollObserver()

    window.addEventListener('scroll', scrollObserver, { passive: true })

    return () => {
      window.removeEventListener('scroll', scrollObserver)
    }
  }, [pathName])

  return { headlines, activeId }
}
