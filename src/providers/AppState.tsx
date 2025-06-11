'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Theme = 'light' | 'dark'

export type AppStateContextValue = {
  mobileNavigationOpen: boolean
  // eslint-disable-next-line no-unused-vars
  setMobileNavigationOpen: (open: boolean) => void

  mobileTocOpen: boolean
  // eslint-disable-next-line no-unused-vars
  setMobileTocOpen: (open: boolean) => void

  searchOpen: boolean
  // eslint-disable-next-line no-unused-vars
  setSearchOpen: (open: boolean) => void

  theme: Theme
  // eslint-disable-next-line no-unused-vars
  setTheme: (theme: Theme) => void
}

export const AppStateContext = createContext<AppStateContextValue>({
  mobileNavigationOpen: false,
  setMobileNavigationOpen: () => {},

  mobileTocOpen: false,
  setMobileTocOpen: () => {},

  searchOpen: false,
  setSearchOpen: () => {},
  
  theme: 'light',
  setTheme: () => {},
})

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')

  // Apply theme class to document when theme changes
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (storedTheme) {
      setTheme(storedTheme)
    } else if (prefersDarkMode) {
      setTheme('dark')
    }
  }, [])

  const providerValue = useMemo(
    () => ({
      mobileNavigationOpen,
      setMobileNavigationOpen,
      mobileTocOpen,
      setMobileTocOpen,
      searchOpen,
      setSearchOpen,
      theme,
      setTheme,
    }),
    [mobileNavigationOpen, mobileTocOpen, searchOpen, theme],
  )

  return <AppStateContext.Provider value={providerValue}>{children}</AppStateContext.Provider>
}

export const useAppState = () => useContext(AppStateContext)
