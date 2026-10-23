// src/components/Requirements.tsx
'use client'

import React, { ReactNode, useState, useSyncExternalStore } from 'react'
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
            'flex items-center justify-between w-full px-2.5 py-1.5 text-sm leading-[140%] text-grayAlpha-900 hover:bg-grayAlpha-100 transition-colors',
            open ? 'bg-grayAlpha-100' : '',
          )}
        >
          <span className="flex-1 text-left">{label}</span>
          <ChevronRightIcon
            className={cn(
              'w-4 h-4 text-grayAlpha-500 transition-transform duration-200',
              open ? 'rotate-90 text-purple-500' : '',
            )}
          />
        </button>
      </Sidebar.Button>

      {open && (
        <div className="markdown pl-6 pt-1 text-sm leading-[150%] text-grayAlpha-600">
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
const DESKTOP_QUERY = '(min-width: 1280px)'

function subscribeToDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export function Requirements({ children }: RequirementsProps) {
  // False on the server and while hydrating, so the portal mounts only in the browser
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  )
  const portalTarget = isDesktop ? document.getElementById('requirements-slot') : null

  const box = <RequirementsBox>{children}</RequirementsBox>

  return (
    <>
      {/* Inline on mobile */}
      <div className="block xl:hidden mt-8">{box}</div>

      {/* Portal into sidebar on desktop */}
      {portalTarget ? createPortal(<div className="mt-8">{box}</div>, portalTarget) : null}
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
