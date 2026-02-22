import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/utils'

export type CardProps = {
  asChild?: boolean
  children: React.ReactNode
  isClickable?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ asChild, children, className, isClickable, ...rest }, ref) => {
    const cardClass = cn(
      'p-5 bg-white dark:bg-gray-900 shadow-cardLight rounded-xl',
      isClickable ? 'transition-shadow hover:shadow-cardHover' : '',
      className,
    )
    const Tag = asChild ? Slot : 'div'

    return (
      <Tag ref={ref} {...rest} className={cardClass}>
        {children}
      </Tag>
    )
  },
)

Card.displayName = 'Card'
