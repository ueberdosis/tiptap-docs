import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { cn } from '@/utils'

export type NavLinkButtonProps = {
  isActive?: boolean
  asChild?: boolean
  variant?: 'default' | 'invert'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const NavLinkButton = forwardRef<HTMLButtonElement, NavLinkButtonProps>(
  ({ children, isActive, asChild, variant = 'default', ...props }, ref) => {
    const linkClass = cn(
      'px-2.5 flex items-center gap-1 py-1.5 rounded-[0.625rem] transition-colors duration-100',
      variant === 'default' && !isActive
        ? 'bg-transparent text-gray-900 dark:text-gray-200 hover:bg-grayAlpha-200 dark:hover:bg-white/10'
        : '',
      variant === 'default' && isActive
        ? 'bg-transparent font-bold text-gray-900 dark:text-white hover:bg-grayAlpha-200 dark:hover:bg-white/10'
        : '',
      variant === 'invert' && !isActive
        ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-gray-200'
        : '',
      variant === 'invert' && isActive
        ? 'bg-black dark:bg-white font-bold text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-gray-200'
        : '',
      props.className,
    )

    const Component = asChild ? Slot : 'button'

    return (
      <Component {...props} ref={ref} className={linkClass}>
        {children}
      </Component>
    )
  },
)

NavLinkButton.displayName = 'NavLinkButton'
