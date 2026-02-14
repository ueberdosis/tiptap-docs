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
      variant === 'default'
        ? 'bg-grayAlpha-100 dark:bg-white/5 border-grayAlpha-200 dark:border-white/10 text-grayAlpha-900 dark:text-gray-200'
        : '',
      variant === 'info'
        ? 'bg-purpleAlpha-50 dark:bg-purple-900/20 border-purpleAlpha-500 dark:border-purple-800 text-grayAlpha-900 dark:text-gray-200'
        : '',
      variant === 'hint'
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-700 dark:text-gray-200'
        : '',
      variant === 'warning'
        ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-800 dark:text-gray-200'
        : '',
      className,
    )

    const iconClass = cn(
      'w-4 h-4',
      variant === 'default' ? 'text-grayAlpha-900 dark:text-gray-200' : '',
      variant === 'info' ? 'text-purpleAlpha-500 dark:text-purple-400' : '',
      variant === 'hint' ? 'text-yellow-600 dark:text-yellow-400' : '',
      variant === 'warning' ? 'text-red-600 dark:text-red-400' : '',
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
