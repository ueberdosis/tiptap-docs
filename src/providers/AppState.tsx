'use client'

import { createContext, useContext, useMemo, useState } from 'react'

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
}

export const AppStateContext = createContext<AppStateContextValue>({
  mobileNavigationOpen: false,
  setMobileNavigationOpen: () => {},

  mobileTocOpen: false,
  setMobileTocOpen: () => {},

  searchOpen: false,
  setSearchOpen: () => {},
})

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const providerValue = useMemo(
    () => ({
      mobileNavigationOpen,
      setMobileNavigationOpen,
      mobileTocOpen,
      setMobileTocOpen,
      searchOpen,
      setSearchOpen,
    }),
    [mobileNavigationOpen, mobileTocOpen, searchOpen],
  )

  return <AppStateContext.Provider value={providerValue}>{children}</AppStateContext.Provider>
}

export const useAppState = () => useContext(AppStateContext)
