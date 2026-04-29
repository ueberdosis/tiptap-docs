'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from './ui/Button'
import { useTheme } from '@/providers/Theme'
import { cn } from '@/utils'

export type ThemeToggleProps = {
  mobile?: boolean
}

/**
 * Toggles the docs theme between light and dark while defaulting to the system theme on first load.
 */
export const ThemeToggle = ({ mobile = false }: ThemeToggleProps) => {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      variant={mobile ? 'secondary' : 'tertiary'}
      size="small"
      onClick={toggleTheme}
      className={cn(
        'shrink-0',
        mobile
          ? 'fixed bottom-4 left-4 z-[70] border border-border bg-card/95 shadow-cardLight backdrop-blur lg:hidden'
          : 'hidden lg:inline-flex',
      )}
    >
      {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  )
}
