import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { Card as CoreCard } from './ui/Card'
import { cn } from '@/utils'

export type CardProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const cardClass = cn('no-markdown grid sm:grid-cols-2 gap-8', className)

    return (
      <CoreCard isClickable asChild={asChild} className={cardClass} ref={ref} {...props}>
        {children}
      </CoreCard>
    )
  },
)

Card.displayName = 'ImageCard.Card'

export type CardImageProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLImageElement>

export const Image = forwardRef<HTMLImageElement, CardImageProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'img'
    const imageClass = cn('rounded-lg shadow-cardLight', className)

    return <Component className={imageClass} ref={ref} {...props} />
  },
)

Image.displayName = 'ImageCard.Image'

export type ContentProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div'
    const contentClass = cn('flex flex-col justify-center', className)

    return <Component className={contentClass} ref={ref} {...props} />
  },
)

Content.displayName = 'ImageCard.Content'

export type CardTitleProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLParagraphElement>

export const Title = forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'p'
    const titleClass = cn('text-base font-bold leading-[140%]', className)

    return <Component className={titleClass} ref={ref} {...props} />
  },
)

Title.displayName = 'ImageCard.Title'

export type CardParagraphProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLParagraphElement>

export const Paragraph = forwardRef<HTMLParagraphElement, CardParagraphProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'p'
    const paragraphClass = cn(
      'text-base leading-[140%]',
      '[&:not(:first-child)]:mt-2 [&:not(:last-child)]:mb-6',
      className,
    )

    return <Component className={paragraphClass} ref={ref} {...props} />
  },
)

Paragraph.displayName = 'ImageCard.Paragraph'
