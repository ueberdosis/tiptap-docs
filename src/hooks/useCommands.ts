import React, { SetStateAction, useCallback, useState } from 'react'

export const useCommands = (items: any[]) => {
  // The selected index belongs to the list it was picked in, so a new list starts unselected
  const [selection, setSelection] = useState<{ items: any[]; index: number | null }>({
    items,
    index: null,
  })
  const currentIndex = selection.items === items ? selection.index : null

  const setCurrentIndex = useCallback(
    (action: SetStateAction<number | null>) => {
      setSelection((prev) => {
        const prevIndex = prev.items === items ? prev.index : null
        return { items, index: typeof action === 'function' ? action(prevIndex) : action }
      })
    },
    [items],
  )

  const handleUp = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault()

      if (items.length <= 0) {
        return
      }

      if (currentIndex === null) {
        setCurrentIndex(items.length - 1)
        return
      }

      setCurrentIndex((prev) => {
        if (!prev) {
          return items.length - 1
        }

        return prev === 0 ? items.length - 1 : prev - 1
      })
    },
    [currentIndex, items, setCurrentIndex],
  )

  const handleDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault()

      if (items.length <= 0) {
        return
      }

      if (currentIndex === null) {
        setCurrentIndex(0)
        return
      }

      setCurrentIndex((prev) => {
        if (prev === null) {
          return 0
        }

        return prev === items.length - 1 ? 0 : prev + 1
      })
    },
    [currentIndex, items, setCurrentIndex],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        handleUp(e)
      }

      if (e.key === 'ArrowDown') {
        handleDown(e)
      }
    },
    [handleUp, handleDown],
  )

  return {
    currentIndex,
    handleDown,
    handleUp,
    onKeyDown,
    items,
  }
}
