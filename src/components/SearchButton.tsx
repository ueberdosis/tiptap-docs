'use client'

import { SearchIcon } from 'lucide-react'
import { Button } from './ui/Button'
import { useAppState } from '@/providers/AppState'

export const SearchButton = () => {
  const { setSearchOpen } = useAppState()

  return (
    <Button
      className="font-normal"
      variant="tertiary"
      size="small"
      onClick={() => setSearchOpen(true)}
    >
      <SearchIcon className="size-4 text-grayAlpha-400" />
      <span className="hidden xl:block text-base leading-[110%] text-gray-900">Search</span>
      <span className="hidden xl:flex font-medium items-center gap-0.5 px-1 py-0.5 rounded border text-xs leading-[110%] shadow-slim border-grayAlpha-100">
        <span>⌘</span>
        <span>K</span>
      </span>
    </Button>
  )
}
