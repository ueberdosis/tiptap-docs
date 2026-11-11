'use client'

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/utils'

type Tone = 'light' | 'dark'

/** A tooltip below its control, on hover and on keyboard focus. The control carries the name. */
const Tip = ({ label, align = 'center' }: { label: string; align?: 'center' | 'end' }) => (
  <span
    aria-hidden
    className={cn(
      'pointer-events-none absolute top-full z-20 mt-1.5 whitespace-nowrap rounded-md bg-grayAlpha-900 px-1.5 py-1 text-[0.6875rem] font-medium leading-none text-white opacity-0 transition-opacity delay-0',
      'group-hover/tip:opacity-100 group-hover/tip:delay-300 group-focus-visible/tip:opacity-100',
      align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0',
    )}
  >
    {label}
  </span>
)

export type ControlButtonProps = {
  /** The accessible name, and the tooltip unless `tooltip` is set. */
  label: string
  tooltip?: string
  tipAlign?: 'center' | 'end'
  isActive?: boolean
  tone?: Tone
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

/** A small button for the demo bar and the code header: an icon, or an icon and a short word. */
export const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ label, tooltip, tipAlign, isActive, tone = 'light', className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        'group/tip relative inline-flex h-7 min-w-7 shrink-0 items-center justify-center gap-1.5 rounded-md px-1.5 text-xs font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-purple-600',
        '[&_svg]:size-3.5 [&_svg]:shrink-0',
        tone === 'light'
          ? isActive
            ? 'bg-white text-grayAlpha-900 shadow-sm ring-1 ring-grayAlpha-200 [&_svg]:text-purple-600'
            : 'text-grayAlpha-500 hover:bg-grayAlpha-100 hover:text-grayAlpha-900'
          : isActive
            ? 'bg-whiteAlpha-200 text-white'
            : 'text-whiteAlpha-600 hover:bg-whiteAlpha-100 hover:text-white',
        className,
      )}
      {...rest}
    >
      {children}
      <Tip label={tooltip ?? label} align={tipAlign} />
    </button>
  ),
)

ControlButton.displayName = 'ControlButton'

/** A link styled like a control button, such as “New tab” or the GitHub source. */
export const ControlLink = ({
  label,
  tooltip,
  tipAlign,
  tone = 'light',
  className,
  children,
  ...rest
}: {
  label: string
  tooltip?: string
  tipAlign?: 'center' | 'end'
  tone?: Tone
  children: ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    aria-label={label}
    className={cn(
      'group/tip relative inline-flex h-7 min-w-7 shrink-0 items-center justify-center gap-1.5 rounded-md px-1.5 text-xs font-semibold transition-colors',
      'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-purple-600',
      '[&_svg]:size-3.5 [&_svg]:shrink-0',
      tone === 'light'
        ? 'text-grayAlpha-500 hover:bg-grayAlpha-100 hover:text-grayAlpha-900'
        : 'text-whiteAlpha-600 hover:bg-whiteAlpha-100 hover:text-white',
      className,
    )}
    {...rest}
  >
    {children}
    <Tip label={tooltip ?? label} align={tipAlign} />
  </a>
)

/** A row of buttons of which one is on, such as Preview / Code / Both. */
export const Segmented = ({
  label,
  tone = 'light',
  className,
  children,
}: {
  label: string
  tone?: Tone
  className?: string
  children: ReactNode
}) => (
  <div
    role="group"
    aria-label={label}
    className={cn(
      'inline-flex shrink-0 items-center gap-0.5 rounded-lg p-0.5',
      tone === 'light' ? 'bg-grayAlpha-100' : 'bg-whiteAlpha-50',
      className,
    )}
  >
    {children}
  </div>
)
