'use client'

import { Slot } from '@radix-ui/react-slot'
import { forwardRef, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'

export type TagProps = {
  asChild?: boolean
  size?: 'small' | 'medium'
  variant?: 'neutral' | 'invert' | 'success' | 'info' | 'hint' | 'warning' | 'gray'
  tooltip?: string
} & React.HTMLAttributes<HTMLSpanElement>

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    { asChild, children, className, size = 'medium', variant = 'neutral', tooltip, ...rest },
    ref,
  ) => {
    const [showTooltip, setShowTooltip] = useState(false)
    const tagRef = useRef<HTMLSpanElement | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
    }, [])

    useEffect(() => {
      if (showTooltip && tagRef.current) {
        const rect = tagRef.current.getBoundingClientRect()
        setTooltipPosition({
          top: rect.top + window.scrollY - 10, // Position above the tag with some margin
          left: rect.left + rect.width / 2 + window.scrollX, // Center horizontally
        })
      }
    }, [showTooltip])

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
      tooltip ? 'cursor-pointer' : '',
      className,
    )
    const Component = asChild ? Slot : 'span'

    const tooltipFontSize = size === 'small' ? 'text-[0.625rem]' : 'text-xs'

    return (
      <>
        <Component
          ref={(el) => {
            if (typeof ref === 'function') {
              ref(el)
            } else if (ref) {
              ref.current = el
            }
            tagRef.current = el
          }}
          {...rest}
          className={tagClass}
          onMouseEnter={tooltip ? () => setShowTooltip(true) : undefined}
          onMouseLeave={tooltip ? () => setShowTooltip(false) : undefined}
        >
          {children}
        </Component>

        {mounted &&
          tooltip &&
          showTooltip &&
          createPortal(
            <div
              className="fixed z-50 pointer-events-none"
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div
                className={cn(
                  'bg-black text-white py-1.5 px-3 rounded-lg font-normal max-w-[280px] break-words text-center',
                  tooltipFontSize,
                )}
              >
                {tooltip}
                <div className="absolute top-full left-1/2 -ml-1.5 border-[6px] border-transparent border-t-black"></div>
              </div>
            </div>,
            document.body,
          )}
      </>
    )
  },
)

Tag.displayName = 'Tag'
