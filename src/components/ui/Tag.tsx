import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { cn } from '@/utils'

export type TagProps = {
  asChild?: boolean
  size?: 'small' | 'medium'
  variant?: 'neutral' | 'invert' | 'success' | 'info' | 'hint' | 'warning' | 'gray'
} & React.HTMLAttributes<HTMLSpanElement>

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ asChild, children, className, size = 'medium', variant = 'neutral', ...rest }, ref) => {
    const tagClass = cn(
      'text-xs font-semibold leading-[120%] px-1.5 py-0.5 border rounded',
      variant === 'neutral' ? 'text-grayAlpha-800 bg-white border-grayAlpha-200' : '',
      variant === 'gray' ? 'bg-grayAlpha-100 border-grayAlpha-100 text-grayAlpha-600' : '',
      variant === 'invert' ? 'text-whiteAlpha-900 bg-grayAlpha-800 border-grayAlpha-800' : '',
      variant === 'success' ? 'text-green-900 bg-green-100 border-[#0BDA81]' : '',
      variant === 'info' ? 'text-purpleAlpha-800 bg-purpleAlpha-50 border-purpleAlpha-500' : '',
      variant === 'hint' ? 'text-yellow-900 bg-yellow-100 border-yellow-500' : '',
      variant === 'warning' ? 'text-red-900 bg-red-100 border-red-500' : '',
      variant === 'gray' ? 'text-grayAlpha-600 bg-grayAlpha-100 border-grayAlpha-100' : '',
      size === 'medium' ? 'text-xs px-1.5 py-0.5' : '',
      size === 'small' ? 'text-[0.625rem] px-1 py-0.5 font-semibold' : '',
      className,
    )
    const Component = asChild ? Slot : 'span'

    return (
      <Component ref={ref} {...rest} className={tagClass}>
        {children}
      </Component>
    )
  },
)

Tag.displayName = 'Tag'
