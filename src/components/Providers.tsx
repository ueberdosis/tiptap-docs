'use client'

import { Toaster } from 'sonner'
import { AppStateProvider } from '@/providers/AppState'
import { usePageTrack } from '@/hooks/usePageTrack'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  usePageTrack()

  return (
    <>
      <Toaster />
      <AppStateProvider>{children}</AppStateProvider>
    </>
  )
}
