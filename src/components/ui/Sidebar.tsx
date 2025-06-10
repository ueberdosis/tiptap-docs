import { Slot } from '@radix-ui/react-slot'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Tag } from './Tag'
import { cn } from '@/utils'

export type SidebarTrack = {} & React.HTMLAttributes<HTMLDivElement>

export const SidebarTrack = forwardRef<HTMLDivElement, SidebarTrack>(
  ({ children, className, ...rest }, ref) => {
    return (
      <nav {...rest} className={cn('flex flex-col gap-10', className)} ref={ref}>
        {children}
      </nav>
    )
  },
)

SidebarTrack.displayName = 'SidebarTrack'

export type SidebarGroupProps = {} & React.HTMLAttributes<HTMLDivElement>

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div {...rest} className={cn('flex flex-col gap-1', className)} ref={ref}>
        {children}
      </div>
    )
  },
)

SidebarGroup.displayName = 'SidebarGroup'

export type SidebarGroupTitleProps = {
  label?: string
} & React.HTMLAttributes<HTMLDivElement>

const SidebarGroupTitle = forwardRef<HTMLDivElement, SidebarGroupTitleProps>(
  ({ children, className, label, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={cn(
          'flex items-center justify-between gap-4 text-grayAlpha-900 mb-2 uppercase text-label font-bold pl-2.5',
          className,
        )}
        ref={ref}
      >
        {children}
        {label ? (
          <Tag className="select-none" size="small">
            {label}
          </Tag>
        ) : null}
      </div>
    )
  },
)

SidebarGroupTitle.displayName = 'SidebarGroupTitle'

export type SidebarButtonProps = {
  asChild?: boolean
  isActive?: boolean
  label?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(
  ({ asChild, children, className, isActive, ...rest }, ref) => {
    const Component = asChild ? Slot : 'button'

    return (
      <Component
        {...rest}
        className={cn(
          'flex items-center justify-between w-full px-2.5 py-1.5 text-sm text-grayAlpha-900 rounded-md',
          !isActive
            ? 'bg-transparent hover:text-grayAlpha-900 hover:bg-grayAlpha-100'
            : 'bg-white text-purple-500 font-semibold',
          className,
        )}
        ref={ref}
      >
        {children}
      </Component>
    )
  },
)

SidebarButton.displayName = 'SidebarButton'

export const Sidebar = {
  Track: SidebarTrack,
  Group: SidebarGroup,
  GroupTitle: SidebarGroupTitle,
  Button: SidebarButton,
}
