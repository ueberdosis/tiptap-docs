import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import Image, { ImageProps } from 'next/image'
import { ArrowRightIcon } from 'lucide-react'
import { Card } from './ui/Card'
import { cn } from '@/utils'

export type CardGridWrapperProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Wrapper = forwardRef<HTMLDivElement, CardGridWrapperProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const cardGridClass = cn('no-markdown grid grid-cols-1 gap-5 my-6 sm:grid-cols-2', className)
    const Component = asChild ? Slot : 'div'

    return (
      <Component ref={ref} {...rest} className={cardGridClass}>
        {children}
      </Component>
    )
  },
)

Wrapper.displayName = 'CardGrid.Wrapper'

export type CardGridItemProps = {
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLDivElement>

export const Item = forwardRef<HTMLDivElement, CardGridItemProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const cardGridItemClass = cn(
      'flex flex-col items-stretch justify-start appearance-none text-left',
      className,
    )

    return (
      <Card isClickable className={cardGridItemClass} ref={ref} {...rest} asChild={asChild}>
        {children}
      </Card>
    )
  },
)

Item.displayName = 'CardGrid.Item'

export type CardGridItemImage = {
  asNextImage?: boolean
} & Omit<ImageProps, 'src'> & {
    src: any
  }

export const ItemImage = forwardRef<HTMLImageElement, CardGridItemImage>(
  ({ asNextImage, className, ...rest }, ref) => {
    const cardGridImageClass = cn('w-full object-cover rounded-lg aspect-[318/165] mb-4', className)
    const Component = asNextImage ? Image : 'img'

    return <Component ref={ref} {...rest} className={cardGridImageClass} />
  },
)

ItemImage.displayName = 'CardGrid.ItemImage'

export type CardGridItemTitleProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLHeadingElement>

export const ItemTitle = forwardRef<HTMLHeadingElement, CardGridItemTitleProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const cardGridTitleClass = cn('leading-[140%] font-bold', className)
    const Component = asChild ? Slot : 'h3'

    return (
      <Component ref={ref} {...rest} className={cardGridTitleClass}>
        {children}
      </Component>
    )
  },
)

ItemTitle.displayName = 'CardGrid.ItemTitle'

export type CardGridItemParagraphProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLParagraphElement>

export const ItemParagraph = forwardRef<HTMLParagraphElement, CardGridItemParagraphProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const cardGridParagraphClass = cn('leading-[140%] mt-2', className)
    const Component = asChild ? Slot : 'div'

    return (
      <Component ref={ref} {...rest} className={cardGridParagraphClass}>
        {children}
      </Component>
    )
  },
)

ItemParagraph.displayName = 'CardGrid.ItemParagraph'

export type CardGridItemFooterProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const ItemFooter = forwardRef<HTMLDivElement, CardGridItemFooterProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const cardGridFooterClass = cn(
      'flex items-center justify-between gap-2 w-full pt-4 mt-auto self-end',
      className,
    )
    const Component = asChild ? Slot : 'footer'

    return (
      <Component ref={ref} {...rest} className={cardGridFooterClass}>
        <div className="flex items-center gap-1">{children}</div>
        <div>
          <ArrowRightIcon className="size-3.5" />
        </div>
      </Component>
    )
  },
)

ItemFooter.displayName = 'CardGrid.ItemFooter'

export type CardGridSubtitleProps = {
  asChild?: boolean
  size?: 'sm' | 'md'
} & React.HTMLAttributes<HTMLSpanElement>

export const Subtitle = forwardRef<HTMLSpanElement, CardGridSubtitleProps>(
  ({ asChild, children, className, size = 'md', ...rest }, ref) => {
    const cardGridItemCountClass = cn(
      'font-black leading-[120%] text-grayAlpha-600 mb-3',
      size === 'md' ? 'text-[1.375rem]' : '',
      size === 'sm' ? 'text-[0.875rem]' : '',
      className,
    )
    const Component = asChild ? Slot : 'span'

    return (
      <Component ref={ref} {...rest} className={cardGridItemCountClass}>
        <div className="inline-block gradient-text">{children}</div>
      </Component>
    )
  },
)

Subtitle.displayName = 'CardGrid.Subtitle'

export type CardGridItemImageIconProps = {} & React.HTMLAttributes<HTMLDivElement>

export const ItemImageIcon = forwardRef<HTMLImageElement, CardGridItemImageIconProps>(
  ({ className, ...rest }, ref) => {
    const imageClassName = cn('h-10 w-auto', className)

    return (
      <div className="mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...rest} ref={ref} className={imageClassName} alt="" />
      </div>
    )
  },
)

ItemImageIcon.displayName = 'CardGrid.ItemImageIcon'
