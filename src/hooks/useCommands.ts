import React, { useCallback, useEffect, useState } from 'react'

export const useCommands = (items: any[]) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  useEffect(() => {
    setCurrentIndex(null)
  }, [items])

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
    [currentIndex, items],
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
    [currentIndex, items],
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
