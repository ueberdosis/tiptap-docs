'use client'

import { usePathname } from 'next/navigation'
import { forwardRef, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import Link from '@/components/Link'
import { SidebarConfig } from '@/types'
import { cn } from '@/utils'
import { generateBreadcrumbs } from '@/utils/generateBreadcrumbs'

export type PageHeaderBreadcrumbsProps = {
  asChild?: boolean
  config: SidebarConfig
  rightContent?: ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const PageHeaderBreadcrumbs = forwardRef<HTMLDivElement, PageHeaderBreadcrumbsProps>(
  ({ asChild, config, className, rightContent, ...props }, ref) => {
    'use client'

    const Component = asChild ? Slot : 'div'
    const pathname = usePathname()

    const crumbs = generateBreadcrumbs(config, pathname)

    const wrapperClass = cn('flex items-center gap-2 mb-3 flex-wrap', className)

    const breadcrumbClass = cn(
      'text-sm leading-[110%] text-grayAlpha-500 font-semibold select-none',
    )

    const clickableBreadcrumbClass = cn(breadcrumbClass, 'text-purple-500 hover:underline')

    const schemaLdJson = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@id': crumb.href,
          name: crumb.text,
        },
      })),
    }

    return (
      <div
        className={cn(
          'flex items-start justify-between flex-wrap gap-y-2 mb-4',
          // // If the text is too long, display the in a single line
          // crumbs.map((crumb) => crumb.text).join(' / ').length > 27
          //   ? 'flex-col md:flex-row gap-2'
          //   : '',
          className,
        )}
      >
        <Component className={wrapperClass} {...props} ref={ref}>
          {crumbs.map((crumb, i) => (
            <div key={crumb.href}>
              {crumb.href ? (
                <Link data-breadcrumb={i} className={clickableBreadcrumbClass} href={crumb.href}>
                  {crumb.text}
                </Link>
              ) : (
                <span className={breadcrumbClass}>{crumb.text}</span>
              )}
              {i < crumbs.length - 1 ? (
                <span className="ml-2 text-sm font-bold select-none text-grayAlpha-400">/</span>
              ) : null}
            </div>
          ))}
        </Component>
        {rightContent}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLdJson) }}
        ></script>
      </div>
    )
  },
)

PageHeaderBreadcrumbs.displayName = 'PageHeader.Breadcrumb'
