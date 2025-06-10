'use client'

import React, { useState, useEffect } from 'react'
import { Square, Check } from 'lucide-react'

interface CheckboxItemProps {
  children: React.ReactNode
  defaultChecked?: boolean
}

export function CheckboxItem({ children, defaultChecked = false }: CheckboxItemProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked)

  const handleToggle = () => {
    setIsChecked(!isChecked)
  }

  // Generate a unique ID for accessibility
  const id = React.useId()

  return (
    <div className="flex items-center my-2">
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleToggle}
        className="sr-only"
        aria-checked={isChecked}
      />
      <label
        htmlFor={id}
        className="flex items-center cursor-pointer select-none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="flex-shrink-0 flex items-center justify-center mr-2">
          <div className="relative w-4 h-4">
            <Square className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
            {isChecked && (
              <Check
                className="w-3 h-3 text-gray-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fade-in"
                strokeWidth={2.5}
              />
            )}
          </div>
        </div>
        <div
          className={`text-base leading-tight ${isChecked ? 'line-through text-grayAlpha-500' : 'text-grayAlpha-800'}`}
        >
          {children}
        </div>
      </label>
    </div>
  )
}

interface ChecklistProps {
  children: React.ReactNode
}

export function Checklist({ children }: ChecklistProps) {
  // Add the animation styles when component mounts
  useEffect(() => {
    // Check if the style is already added
    const styleId = 'checklist-animations'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .fade-in {
          animation: fadeIn 0.1s ease-in forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  return <div className="my-6">{children}</div>
}
