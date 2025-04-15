'use client'

import { ExternalLinkIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { HTMLAttributeAnchorTarget, forwardRef } from 'react'
import Link from '@/components/Link'
import { NavLinkButton } from '@/components/ui/NavLinkButton'

export type NavLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  target?: HTMLAttributeAnchorTarget
  isDirectActive?: boolean
  hideIcon?: boolean
  variant?: 'default' | 'invert'
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ children, className, href, hideIcon, variant = 'default', target, isDirectActive }, ref) => {
    const pathname = usePathname()
    const isExternal = href.startsWith('http')

    const isActive = pathname === href
    const isActiveParent = href !== '/' && pathname.startsWith(`${href}`)

    const innerLinkContent = (
      <>
        {children}
        {isExternal && !hideIcon ? (
          <ExternalLinkIcon className="size-3.5 text-grayAlpha-400" />
        ) : null}
      </>
    )

    const linkContent = isExternal ? (
      <a ref={ref} target={target} href={href}>
        {innerLinkContent}
      </a>
    ) : (
      <Link ref={ref} target={target} href={href}>
        {innerLinkContent}
      </Link>
    )

    return (
      <NavLinkButton
        isActive={isDirectActive ? isActive : isActive || isActiveParent}
        asChild
        variant={variant}
        className={className}
      >
        {linkContent}
      </NavLinkButton>
    )
  },
)

NavLink.displayName = 'NavLink'
