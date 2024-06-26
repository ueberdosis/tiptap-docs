import { forwardRef } from 'react'
import { InfoIcon, MessageCircleIcon, OctagonAlertIcon } from 'lucide-react'
import { cn } from '@/utils'

export type CalloutProps = {
  title: string
  variant: 'default' | 'info' | 'hint' | 'warning'
  size: 'sm' | 'md'
  hasCalloutBefore?: boolean
  hasCalloutAfter?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      title,
      hasCalloutAfter,
      hasCalloutBefore,
      variant = 'default',
      size = 'sm',
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
      variant === 'default' ? 'bg-grayAlpha-100 border-grayAlpha-200 text-grayAlpha-900' : '',
      variant === 'info' ? 'bg-purpleAlpha-50 border-purpleAlpha-500 text-grayAlpha-900' : '',
      variant === 'hint' ? 'bg-yellow-50 border-yellow-500' : '',
      variant === 'warning' ? 'bg-red-50 border-red-400' : '',
      className,
    )

    const iconClass = cn(
      'w-4 h-4',
      variant === 'default' ? 'text-grayAlpha-900' : '',
      variant === 'info' ? 'text-purpleAlpha-500' : '',
      variant === 'hint' ? 'text-yellow-600' : '',
      variant === 'warning' ? 'text-red-600' : '',
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
        <div className="flex-none">
          {variant === 'default' ? <MessageCircleIcon className={iconClass} /> : null}
          {variant === 'info' ? <InfoIcon className={iconClass} /> : null}
          {variant === 'hint' ? <InfoIcon className={iconClass} /> : null}
          {variant === 'warning' ? <OctagonAlertIcon className={iconClass} /> : null}
        </div>
        <div className="flex-1">
          <h3 className={titleClass}>{title}</h3>
          <div className={contentClass}>{children}</div>
        </div>
      </div>
    )
  },
)

Callout.displayName = 'Callout'
