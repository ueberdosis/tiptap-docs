'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Dispatch, SetStateAction } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export type ThemeContextValue = {
  preference: ThemePreference
  resolvedTheme: ResolvedTheme
  setPreference: Dispatch<SetStateAction<ThemePreference>>
  toggleTheme: () => void
}

const STORAGE_KEY = 'docs-theme'

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  resolvedTheme: 'light',
  setPreference: () => {},
  toggleTheme: () => {},
})

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialPreference(): ThemePreference {
  if (typeof document === 'undefined') {
    return 'system'
  }

  const theme = document.documentElement.dataset.themePreference

  if (theme === 'light' || theme === 'dark' || theme === 'system') {
    return theme
  }

  return 'system'
}

function applyTheme(preference: ThemePreference) {
  const resolvedTheme = preference === 'system' ? getSystemTheme() : preference

  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.dataset.themePreference = preference
  document.documentElement.style.colorScheme = resolvedTheme

  if (preference === 'system') {
    window.localStorage.removeItem(STORAGE_KEY)
  } else {
    window.localStorage.setItem(STORAGE_KEY, preference)
  }

  return resolvedTheme
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(getInitialPreference)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    preference === 'system' ? getSystemTheme() : preference,
  )

  useEffect(() => {
    setResolvedTheme(applyTheme(preference))
  }, [preference])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const onChange = () => {
      if (preference === 'system') {
        setResolvedTheme(applyTheme('system'))
      }
    }

    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }, [preference])

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolvedTheme,
      setPreference: setPreferenceState,
      toggleTheme: () =>
        setPreferenceState((current) => {
          const activeTheme = current === 'system' ? getSystemTheme() : current
          return activeTheme === 'dark' ? 'light' : 'dark'
        }),
    }),
    [preference, resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
