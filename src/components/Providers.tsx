'use client'

import { Toaster } from 'sonner'
import { AppStateProvider } from '@/providers/AppState'
import { ThemeProvider } from '@/providers/Theme'
import { usePageTrack } from '@/hooks/usePageTrack'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  usePageTrack()

  return (
    <>
      <Toaster />
      <ThemeProvider>
        <AppStateProvider>{children}</AppStateProvider>
      </ThemeProvider>
    </>
  )
}
