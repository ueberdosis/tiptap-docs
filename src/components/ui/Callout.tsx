import { forwardRef } from 'react'
import { InfoIcon, MessageCircleIcon, OctagonAlertIcon } from 'lucide-react'
import { cn } from '@/utils'

export type CalloutProps = {
  title: string
  variant: 'default' | 'info' | 'hint' | 'warning'
  size: 'sm' | 'md'
  hasCalloutBefore?: boolean
  hasCalloutAfter?: boolean
  hideIcon?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      title,
      hasCalloutAfter,
      hasCalloutBefore,
      variant = 'default',
      size = 'sm',
      hideIcon = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const wrapperClass = cn(
      'c-callout content-block flex flex-col md:flex-row gap-3 items-start border rounded-[10px] p-4',
      hasCalloutAfter ? 'mb-2' : 'mb-8',
      hasCalloutBefore ? 'mt-2' : 'mt-8',
      variant === 'default' ? 'bg-surface-muted border-border text-foreground' : '',
      variant === 'info' ? 'bg-info-muted border-info-border text-foreground' : '',
      variant === 'hint' ? 'bg-warning-muted border-warning-border' : '',
      variant === 'warning' ? 'bg-destructive-muted border-destructive-border' : '',
      className,
    )

    const iconClass = cn(
      'w-4 h-4',
      variant === 'default' ? 'text-foreground' : '',
      variant === 'info' ? 'text-info' : '',
      variant === 'hint' ? 'text-warning' : '',
      variant === 'warning' ? 'text-destructive' : '',
    )

    const titleClass = cn(
      'leading-none font-semibold mb-2',
      size === 'sm' ? 'text-base' : '',
      size === 'md' ? 'text-base' : '',
    )

    const contentClass = cn(
      'markdown',
      size === 'sm' ? 'text-base' : '',
      size === 'md' ? 'text-base' : '',
    )

    return (
      <div className={wrapperClass} ref={ref} {...rest}>
        {!hideIcon && (
          <div className="flex-none">
            {variant === 'default' ? <MessageCircleIcon className={iconClass} /> : null}
            {variant === 'info' ? <InfoIcon className={iconClass} /> : null}
            {variant === 'hint' ? <InfoIcon className={iconClass} /> : null}
            {variant === 'warning' ? <OctagonAlertIcon className={iconClass} /> : null}
          </div>
        )}
        <div className="flex-1">
          <h3 className={titleClass}>{title}</h3>
          <div className={contentClass}>{children}</div>
        </div>
      </div>
    )
  },
)

Callout.displayName = 'Callout'
