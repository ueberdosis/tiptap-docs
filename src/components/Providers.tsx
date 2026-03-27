'use client'

import { Toaster } from 'sonner'
import { usePageTrack } from '@/hooks/usePageTrack'
import { AppStateProvider } from '@/providers/AppState'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  usePageTrack()

  return (
    <>
      <Toaster />
      <AppStateProvider>{children}</AppStateProvider>
    </>
  )
}
