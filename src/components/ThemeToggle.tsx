'use client'

import React from 'react'
import { MoonStar, Sun } from 'lucide-react'
import { useAppState } from '@/providers/AppState'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useAppState()

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonStar size={16} /> : <Sun size={16} />}
    </button>
  )
}
