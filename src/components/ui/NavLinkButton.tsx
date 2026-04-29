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
        ? 'bg-transparent text-foreground hover:bg-interactive-hover'
        : '',
      variant === 'default' && isActive
        ? 'bg-transparent font-bold text-foreground hover:bg-interactive-hover'
        : '',
      variant === 'invert' && !isActive
        ? 'bg-inverse text-inverse-foreground hover:bg-inverse/90'
        : '',
      variant === 'invert' && isActive
        ? 'bg-inverse font-bold text-inverse-foreground hover:bg-inverse/90'
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
