import { Slot } from '@radix-ui/react-slot'
import React, { forwardRef } from 'react'
import { cn } from '@/utils'

export type GridWrapperProps = {
  asChild?: boolean
} & React.HTMLProps<HTMLDivElement>

export const Wrapper = forwardRef<HTMLDivElement, GridWrapperProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : 'div'
    const wrapperClass = cn('no-markdown grid gap-8', className)

    return (
      <Component className={wrapperClass} ref={ref} {...props}>
        {children}
      </Component>
    )
  },
)

Wrapper.displayName = 'Grid.Wrapper'

export type GridItemProps = {
  asChild?: boolean
} & React.HTMLProps<HTMLDivElement>

export const Item = forwardRef<HTMLDivElement, GridItemProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : 'div'
    const itemClass = cn('group', className)

    return (
      <Component className={itemClass} ref={ref} {...props}>
        {children}
      </Component>
    )
  },
)

Item.displayName = 'Grid.Item'

export type GridItemHeaderProps = {
  asChild?: boolean
} & React.HTMLProps<HTMLElement>

export const ItemHeader = forwardRef<HTMLElement, GridItemHeaderProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : 'header'
    const itemHeaderClass = cn('mb-4', className)

    return (
      <Component className={itemHeaderClass} ref={ref} {...props}>
        {children}
      </Component>
    )
  },
)

ItemHeader.displayName = 'Grid.ItemHeader'

export type GridItemContentProps = {
  asChild?: boolean
} & React.HTMLProps<HTMLDivElement>

export const ItemContent = forwardRef<HTMLDivElement, GridItemContentProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : 'div'
    const itemContentClass = cn('', className)

    return (
      <Component className={itemContentClass} ref={ref} {...props}>
        {children}
      </Component>
    )
  },
)

ItemContent.displayName = 'Grid.ItemContent'

export type GridItemTitleProps = {
  asChild?: boolean
} & React.HTMLProps<HTMLHeadingElement>

export const ItemTitle = forwardRef<HTMLHeadingElement, GridItemTitleProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : 'h3'
    const itemTitleClass = cn('text-base font-bold mb-2 leading-[140%]', className)

    return (
      <Component className={itemTitleClass} ref={ref} {...props}>
        {children}
      </Component>
    )
  },
)

ItemTitle.displayName = 'Grid.ItemTitle'

export type GridItemParagraph = {
  asChild?: boolean
} & React.HTMLProps<HTMLParagraphElement>

export const ItemParagraph = forwardRef<HTMLParagraphElement, GridItemParagraph>(
  ({ asChild, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : 'div'
    const itemParagraphClass = cn('text-base leading-[140%]', className)

    return (
      <Component className={itemParagraphClass} ref={ref} {...props}>
        {children}
      </Component>
    )
  },
)

ItemParagraph.displayName = 'Grid.ItemParagraph'
