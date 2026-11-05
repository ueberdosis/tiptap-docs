import { useCallback, useSyncExternalStore } from 'react'

// A query parameter as state. Unlike useQueryParam, it renders the default
// during hydration and the URL's value right after, so the server-rendered
// HTML always matches.

const CHANGE_EVENT = 'urlparamchange'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

// eslint-disable-next-line no-unused-vars
type Setter<T> = (value: T) => void

export function useUrlParam<T extends string = string>(
  key: string,
  defaultValue: NoInfer<T>,
): [T, Setter<T>] {
  const value = useSyncExternalStore(
    subscribe,
    () => (new URLSearchParams(window.location.search).get(key) as T | null) ?? defaultValue,
    () => defaultValue,
  )

  const setValue = useCallback(
    (next: T) => {
      const params = new URLSearchParams(window.location.search)
      if (next === defaultValue || next === '') params.delete(key)
      else params.set(key, next)
      // Commas separate the values of a list filter; they need no escaping in a query
      const search = params.toString().replace(/%2C/gi, ',')
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${search ? `?${search}` : ''}`,
      )
      window.dispatchEvent(new Event(CHANGE_EVENT))
    },
    [key, defaultValue],
  )

  return [value, setValue]
}
