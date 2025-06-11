// src/components/Requirements.tsx
'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRightIcon } from 'lucide-react'
import { Sidebar } from './ui/Sidebar'
import { cn } from '@/utils'

export type RequirementItemProps = {
  /** Primary label, e.g. "Activate your trial" */
  label: string
  /** Detail content — can include <a> tags */
  children: ReactNode
}

/**
 * Single requirement row. Clicking toggles its detail.
 */
export function RequirementItem({ label, children }: RequirementItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      {/* Wrap in Sidebar.Button so it picks up the same sidebar text styles */}
      <Sidebar.Button asChild>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'flex items-center justify-between w-full px-2.5 py-1.5 text-sm leading-[140%] requirements-button transition-colors',
            open ? 'requirements-button-active' : '',
          )}
        >
          <span className="flex-1 text-left">{label}</span>
          <ChevronRightIcon
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              open ? 'rotate-90 requirements-chevron-active' : 'requirements-chevron',
            )}
          />
        </button>
      </Sidebar.Button>

      {open && (
        <div className="markdown pl-6 pt-1 text-sm leading-[150%] requirements-content">
          {children}
        </div>
      )}
    </div>
  )
}

export type RequirementsProps = {
  children: ReactNode
}

/**
 * Wraps <RequirementItem/>s and portals them into the sidebar on desktop.
 */
export function Requirements({ children }: RequirementsProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const portalTarget = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    portalTarget.current = document.getElementById('requirements-slot')
    return () => mq.removeEventListener('change', update)
  }, [])

  const box = <RequirementsBox>{children}</RequirementsBox>

  return (
    <>
      {/* Inline on mobile */}
      <div className="block xl:hidden mt-8">{box}</div>

      {/* Portal into sidebar on desktop */}
      {isDesktop && portalTarget.current
        ? createPortal(<div className="mt-8">{box}</div>, portalTarget.current)
        : null}
    </>
  )
}

function RequirementsBox({ children }: { children: ReactNode }) {
  return (
    <div>
      <Sidebar.Track>
        <Sidebar.Group>
          <Sidebar.GroupTitle>Requirements</Sidebar.GroupTitle>
          {React.Children.map(children, (child, idx) => (
            <React.Fragment key={idx}>{child}</React.Fragment>
          ))}
        </Sidebar.Group>
      </Sidebar.Track>
    </div>
  )
}
