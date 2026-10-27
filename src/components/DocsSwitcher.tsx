'use client'

import { usePathname } from 'next/navigation'
import { NavLink } from './NavLink'

export const DOCS_AREAS = [
  { label: 'Documentation', href: '/', prefix: '' },
  {
    label: 'UI Components',
    href: '/ui-components/getting-started/overview',
    prefix: '/ui-components',
  },
]

/** The area a path belongs to: UI Components, or the documentation for everything else. */
export function activeDocsArea(pathname: string) {
  return DOCS_AREAS.find((area) => area.prefix && pathname.startsWith(area.prefix)) ?? DOCS_AREAS[0]
}

/** Switches between the two areas of the docs, each with its own sidebar. */
export const DocsSwitcher = () => {
  const active = activeDocsArea(usePathname())

  return (
    <>
      {DOCS_AREAS.map((area) => (
        <NavLink key={area.href} href={area.href} isDirectActive isActive={area === active}>
          {area.label}
        </NavLink>
      ))}
    </>
  )
}
