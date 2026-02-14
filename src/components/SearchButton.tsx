'use client'

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
      <SearchIcon />
      <span className="hidden xl:block text-base leading-[110%] text-gray-900 dark:text-gray-200">
        Search
      </span>
      <span className="hidden xl:flex font-medium items-center gap-0.5 px-1 py-0.5 rounded border text-xs leading-[110%] shadow-slim border-grayAlpha-100 dark:border-gray-700 text-gray-900 dark:text-gray-300">
        <span>⌘</span>
        <span>K</span>
      </span>
    </Button>
  )
}

const SearchIcon = () => {
  return (
    <svg
      className="size-4 text-grayAlpha-400 dark:text-gray-400"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11ZM11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C13.125 20 15.078 19.2635 16.6177 18.0319L20.2928 21.7071C20.6834 22.0976 21.3165 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L18.0319 16.6177C19.2635 15.078 20 13.125 20 11C20 6.02944 15.9706 2 11 2Z"
        fill="currentColor"
      />
    </svg>
  )
}
