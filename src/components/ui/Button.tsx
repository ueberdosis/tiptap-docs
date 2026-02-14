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
              ? 'bg-grayAlpha-800 dark:bg-white text-white dark:text-black hover:bg-grayAlpha-900 dark:hover:bg-gray-200 group-hover:bg-grayAlpha-900 dark:group-hover:bg-gray-200 active:bg-grayAlpha-900 dark:active:bg-gray-300'
              : '',
            variant === 'primary' && isActive ? 'bg-grayAlpha-900 dark:bg-gray-300' : '',
            variant === 'secondary' && !isActive
              ? 'bg-grayAlpha-100 dark:bg-white/10 text-black dark:text-white hover:bg-grayAlpha-200 dark:hover:bg-white/20 group-hover:bg-grayAlpha-200 dark:group-hover:bg-white/20 active:bg-grayAlpha-100 dark:active:bg-white/10'
              : '',
            variant === 'secondary' && isActive ? 'bg-grayAlpha-100 dark:bg-white/10' : '',
            variant === 'tertiary' && !isActive
              ? 'bg-transparent text-black dark:text-white hover:bg-grayAlpha-200 dark:hover:bg-white/10 group-hover:bg-grayAlpha-200 dark:group-hover:bg-white/10 active:bg-grayAlpha-100 dark:active:bg-white/5'
              : '',
            variant === 'tertiary' && isActive ? 'bg-grayAlpha-100 dark:bg-white/10' : '',
          )
        : cn(
            variant === 'primary' ? 'bg-transparent text-grayAlpha-400 dark:text-gray-600' : '',
            variant === 'secondary'
              ? 'bg-grayAlpha-50 dark:bg-white/5 text-grayAlpha-400 dark:text-gray-600'
              : '',
            variant === 'tertiary' ? 'bg-transparent text-grayAlpha-400 dark:text-gray-600' : '',
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
