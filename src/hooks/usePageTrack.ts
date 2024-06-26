'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { BASE_PATH, FULL_DOMAIN } from '@/utils/constants'

export const usePageTrack = () => {
  const pathname = usePathname()
  const isInitialMount = useRef(true)
  const previousPathname = useRef<string | null>(null)
  const previousURLQuery = useRef<string | null>(null)

  useEffect(() => {
    ;(window as any).dataLayer = (window as any).dataLayer || []

    if (isInitialMount.current) {
      isInitialMount.current = false
      previousPathname.current = pathname
      previousURLQuery.current = window.location.search
      return
    }

    // Track page view
    window.requestAnimationFrame(() => {
      if (
        previousPathname.current !== pathname &&
        (previousPathname.current || document.referrer)
      ) {
        let pageReferrer = document.referrer

        if (previousPathname.current) {
          pageReferrer = `${FULL_DOMAIN}${previousPathname.current}`
        }

        const win = window as any
        const ev = {
          event: 'page_view',
          page_path: `${BASE_PATH}${pathname}`,
          page_title: document.title,
          page_referrer: pageReferrer + previousURLQuery.current,
        }

        win.dataLayer.push(ev)
      }
      previousPathname.current = pathname
      previousURLQuery.current = window.location.search
    })
  }, [pathname])
}
