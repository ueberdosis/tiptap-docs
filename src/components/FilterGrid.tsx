'use client'

import { createContext, useContext, useState } from 'react'
import { Button } from './ui/Button'

export type FilterGridContextValue = {
  currentFilter: string | null
  // eslint-disable-next-line no-unused-vars
  setCurrentFilter: (filter: string | null) => void
}

export const FilterGridContext = createContext<FilterGridContextValue>({
  currentFilter: null,
  setCurrentFilter: () => {},
})

export const useFilterGrid = () => useContext(FilterGridContext)

export type FilterGridWrapperProps = {
  filters: string[]
  initialFilter?: string
  children: React.ReactNode
}

export const Wrapper = ({ filters, initialFilter, children }: FilterGridWrapperProps) => {
  const [currentFilter, setCurrentFilter] = useState<FilterGridContextValue['currentFilter']>(
    initialFilter || null,
  )

  return (
    <FilterGridContext.Provider value={{ currentFilter, setCurrentFilter }}>
      <div className="flex flex-col gap-5 my-12 first:mt-0 last:mb-0">
        <div className="flex items-center gap-1">
          <Button
            variant="tertiary"
            isActive={currentFilter === null}
            onClick={() => setCurrentFilter(null)}
          >
            All
          </Button>
          {filters.map((filter) => (
            <Button
              variant="tertiary"
              isActive={currentFilter === filter}
              key={filter}
              onClick={() => setCurrentFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
        <div>{children}</div>
      </div>
    </FilterGridContext.Provider>
  )
}

export type ItemProps = {
  filter: string | string[]
  children: React.ReactNode
}

export const Item = ({ filter, children }: ItemProps) => {
  const { currentFilter } = useFilterGrid()

  const hasFilter = !currentFilter !== null
  const isFilter =
    currentFilter === null || currentFilter === filter || filter.includes(currentFilter)

  if (!hasFilter || !isFilter) {
    return null
  }

  return children
}
