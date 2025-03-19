import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { CheckIcon } from 'lucide-react'
import { NoisePattern } from './NoisePattern'
import { cn } from '@/utils'

import gradientBgDark from '@/assets/gradient-bg.svg?url'
import gradientBgLight from '@/assets/gradient-bg-light.svg?url'

export type WrapperProps = {
  asChild?: boolean
  variant?: 'dark' | 'light'
} & React.HTMLAttributes<HTMLDivElement>

export const Wrapper = forwardRef<HTMLDivElement, WrapperProps>(
  ({ asChild, variant = 'dark', children, className, ...rest }, ref) => {
    const boxClass = cn(
      'no-markdown relative text-white rounded-xl bg-gray-950 overflow-hidden shadow-cardLight',
      'transition-shadow hover:shadow-cardHover',
      variant === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-black',
      className,
    )
    const patternClass = cn(
      'absolute bottom-0 right-0 rotate-45 z-0',
      variant === 'dark' ? 'translate-x-[40%] translate-y-[52%] rotate-45' : '',
      variant === 'light' ? 'translate-x-[40%] translate-y-[43%] rotate-12' : '',
    )
    const imageClass = cn('bg-cover', variant === 'dark' ? 'size-[48rem]' : 'size-[38rem]')

    const Component = asChild ? Slot : 'section'

    return (
      <Component ref={ref} {...rest} className={boxClass}>
        <div className="relative z-10 p-8">{children}</div>
        <NoisePattern variant={variant} className={patternClass}>
          <div
            style={{
              backgroundImage: `url(${variant === 'dark' ? gradientBgDark.src : gradientBgLight.src})`,
            }}
            className={imageClass}
          />
        </NoisePattern>
      </Component>
    )
  },
)

Wrapper.displayName = 'CtaBox.Wrapper'

export type TitleProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLHeadingElement>

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const titleClass = cn('text-[1.75rem] leading-[110%] font-serif', className)
    const Component = asChild ? Slot : 'h2'

    return (
      <Component ref={ref} {...rest} className={titleClass}>
        {children}
      </Component>
    )
  },
)

Title.displayName = 'CtaBox.Title'

export type DescriptionProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLParagraphElement>

export const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const descriptionClass = cn('mt-2.5 text-[1.125rem] leading-[160%]', className)
    const Component = asChild ? Slot : 'div'

    return (
      <Component ref={ref} {...rest} className={descriptionClass}>
        {children}
      </Component>
    )
  },
)

Description.displayName = 'CtaBox.Description'

export type ListProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLUListElement>

export const List = forwardRef<HTMLUListElement, ListProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const listClass = cn('mt-5 space-y-1', className)
    const Component = asChild ? Slot : 'ul'

    return (
      <Component ref={ref} {...rest} className={listClass}>
        {children}
      </Component>
    )
  },
)

List.displayName = 'CtaBox.List'

export type ListItemProps = {
  asChild?: boolean
  title?: string
} & React.HTMLAttributes<HTMLLIElement>

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ asChild, children, className, title, ...rest }, ref) => {
    const listItemClass = cn('flex items-center gap-2', className)
    const Component = asChild ? Slot : 'li'

    return (
      <Component ref={ref} {...rest} className={listItemClass}>
        <span className="block flex-none">
          <CheckIcon className="size-5 text-green" />
        </span>
        <span className="block flex-1">
          {title ? <span className="font-semibold">{title}</span> : null}
          {children}
        </span>
      </Component>
    )
  },
)

ListItem.displayName = 'CtaBox.ListItem'

export type ActionsProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Actions = forwardRef<HTMLDivElement, ActionsProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const actionsClass = cn('mt-4 flex items-center gap-1', className)
    const Component = asChild ? Slot : 'div'

    return (
      <Component ref={ref} {...rest} className={actionsClass}>
        {children}
      </Component>
    )
  },
)

Actions.displayName = 'CtaBox.Actions'
