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
              ? 'bg-inverse text-inverse-foreground hover:bg-inverse/95 group-hover:bg-inverse/95 active:bg-inverse/95'
              : '',
            variant === 'primary' && isActive ? 'bg-inverse/95 text-inverse-foreground' : '',
            variant === 'secondary' && !isActive
              ? 'bg-interactive-active text-foreground hover:bg-interactive-hover group-hover:bg-interactive-hover active:bg-interactive-active'
              : '',
            variant === 'secondary' && isActive ? 'bg-interactive-active text-foreground' : '',
            variant === 'tertiary' && !isActive
              ? 'bg-transparent text-foreground hover:bg-interactive-hover group-hover:bg-interactive-hover active:bg-interactive-active'
              : '',
            variant === 'tertiary' && isActive ? 'bg-interactive-active text-foreground' : '',
          )
        : cn(
            variant === 'primary' ? 'bg-transparent text-foreground-subtle' : '',
            variant === 'secondary' ? 'bg-surface-muted text-foreground-subtle' : '',
            variant === 'tertiary' ? 'bg-transparent text-foreground-subtle' : '',
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
