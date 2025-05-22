import { useState } from 'react'

const getQuery = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search)
  }
  return new URLSearchParams()
}

const getQueryStringVal = (key: string): string | null => {
  return getQuery().get(key)
}

export function useQueryParam<T extends string = string>(
  key: string,
  defaultVal: NoInfer<T>,
  // eslint-disable-next-line no-unused-vars
): [T, (val: T) => void] {
  const [query, setQuery] = useState(getQueryStringVal(key) || defaultVal)

  const updateUrl = (newVal: string) => {
    setQuery(newVal)

    const query = getQuery()

    if (newVal.trim() !== '') {
      query.set(key, newVal)
    } else {
      query.delete(key)
    }

    // This check is necessary if using the hook with Gatsby
    if (typeof window !== 'undefined') {
      const { protocol, pathname, host } = window.location
      const newUrl = `${protocol}//${host}${pathname}?${query.toString()}`
      window.history.pushState({}, '', newUrl)
    }
  }

  return [query as T, updateUrl]
}
