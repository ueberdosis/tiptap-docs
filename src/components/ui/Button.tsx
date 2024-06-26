import { Slot } from '@radix-ui/react-slot'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils'

export type ButtonProps = {
  asChild?: boolean
  size?: 'medium' | 'small'
  variant?: 'primary' | 'secondary' | 'tertiary'
  isActive?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { asChild, children, className, isActive, size = 'medium', variant = 'primary', ...rest },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button'

    const buttonClassName = cn(
      'flex items-center font-semibold leading-[110%] rounded-lg transition-colors duration-100',

      !rest.disabled
        ? cn(
            variant === 'primary' && !isActive
              ? 'bg-grayAlpha-800 text-white hover:bg-grayAlpha-900 group-hover:bg-grayAlpha-900 active:bg-grayAlpha-900'
              : '',
            variant === 'primary' && isActive ? 'bg-grayAlpha-900' : '',
            variant === 'secondary' && !isActive
              ? 'bg-grayAlpha-100 text-black hover:bg-grayAlpha-200 group-hover:bg-grayAlpha-200 active:bg-grayAlpha-100'
              : '',
            variant === 'secondary' && isActive ? 'bg-grayAlpha-100' : '',
            variant === 'tertiary' && !isActive
              ? 'bg-transparent text-black hover:bg-grayAlpha-200 group-hover:bg-grayAlpha-200 active:bg-grayAlpha-100'
              : '',
            variant === 'tertiary' && isActive ? 'bg-grayAlpha-100' : '',
          )
        : cn(
            variant === 'primary' ? 'bg-transparent text-grayAlpha-400' : '',
            variant === 'secondary' ? 'bg-grayAlpha-50 text-grayAlpha-400' : '',
            variant === 'tertiary' ? 'bg-transparent text-grayAlpha-400' : '',
          ),

      size === 'medium' ? 'p-3 text-sm gap-1.5' : '',
      size === 'small' ? 'p-2 text-xs gap-1' : '',

      className,
    )

    return (
      <Component ref={ref} className={buttonClassName} {...rest}>
        {children}
      </Component>
    )
  },
)

Button.displayName = 'Button'
