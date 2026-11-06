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
  isActive?: boolean
  isDirectActive?: boolean
  hideIcon?: boolean
  variant?: 'default' | 'invert'
  // Anything else goes to the link, such as the role and handlers of a menu item
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'className'>

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      children,
      className,
      href,
      hideIcon,
      variant = 'default',
      target,
      isDirectActive,
      isActive: isActiveProp,
      ...rest
    },
    ref,
  ) => {
    const pathname = usePathname()
    const isExternal = href.startsWith('http')

    const isActive = pathname === href
    const isActiveParent = href !== '/' && pathname.startsWith(`${href}`)

    return (
      <NavLinkButton
        isActive={
          isDirectActive ? isActiveProp || isActive : isActiveProp || isActive || isActiveParent
        }
        asChild
        variant={variant}
        className={className}
      >
        <Link {...rest} ref={ref} target={target} href={href}>
          {children}
          {isExternal && !hideIcon ? (
            <ExternalLinkIcon className="size-3.5 text-grayAlpha-400" />
          ) : null}
        </Link>
      </NavLinkButton>
    )
  },
)

NavLink.displayName = 'NavLink'
