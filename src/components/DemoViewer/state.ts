import { useCallback, useSyncExternalStore } from 'react'

export type View = 'preview' | 'code' | 'both'
export type Theme = 'light' | 'dark'
export type Size = 'desktop' | 'tablet' | 'phone'
export type Framework = 'React' | 'Vue' | 'Svelte' | 'JS'

export const VIEWS: View[] = ['preview', 'code', 'both']
export const THEMES: Theme[] = ['light', 'dark']
export const SIZES: Size[] = ['desktop', 'tablet', 'phone']
export const FRAMEWORKS: Framework[] = ['React', 'Vue', 'Svelte', 'JS']

/** The frameworks a demo offers unless the page names them. */
export const DEFAULT_FRAMEWORKS: Framework[] = ['React', 'Vue']

/** `"React"`, `"React, Vue"` or `['React', 'Vue']`, as written in MDX. */
export const parseFrameworks = (value: Framework[] | string | undefined): Framework[] => {
  if (!value) return DEFAULT_FRAMEWORKS
  const names = typeof value === 'string' ? value.split(',') : value
  const known = FRAMEWORKS.filter((framework) =>
    names.some((name) => name.trim().toLowerCase() === framework.toLowerCase()),
  )
  return known.length ? known : DEFAULT_FRAMEWORKS
}

/** The width of the demo frame for each size; desktop fills the element. */
export const SIZE_WIDTHS: Record<Size, string> = {
  desktop: '100%',
  tablet: '768px',
  phone: '375px',
}

/* The reader's framework: one choice for every demo, kept in localStorage */

const FRAMEWORK_KEY = 'tiptap-docs:demo-framework'
const FRAMEWORK_EVENT = 'tiptap-docs:demo-framework'

const readFramework = (): Framework => {
  try {
    const stored = window.localStorage.getItem(FRAMEWORK_KEY)
    return FRAMEWORKS.find((framework) => framework === stored) ?? 'React'
  } catch {
    return 'React'
  }
}

const subscribeFramework = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  window.addEventListener(FRAMEWORK_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(FRAMEWORK_EVENT, onChange)
  }
}

export const useStoredFramework = () => {
  const framework = useSyncExternalStore(subscribeFramework, readFramework, () => 'React' as const)

  const setFramework = useCallback((value: Framework) => {
    try {
      window.localStorage.setItem(FRAMEWORK_KEY, value)
    } catch {
      // Private mode: the choice holds for this page only
    }
    window.dispatchEvent(new Event(FRAMEWORK_EVENT))
  }, [])

  return [framework, setFramework] as const
}

/*
 * A link can open a demo in a given state: `#demo-extensions-comments:both,vue,phone,dark`.
 * The part before the colon is the element's id, the words after it in any order.
 */

export type HashState = Partial<{ view: View; framework: Framework; size: Size; theme: Theme }>

const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export const useHash = () =>
  useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    () => '',
  )

export const parseHash = (hash: string, id: string): HashState | null => {
  const [target, words = ''] = decodeURIComponent(hash.replace(/^#/, '')).split(':')

  if (target !== id) {
    return null
  }

  const state: HashState = {}

  for (const word of words.toLowerCase().split(',')) {
    if ((VIEWS as string[]).includes(word)) state.view = word as View
    if ((THEMES as string[]).includes(word)) state.theme = word as Theme
    if ((SIZES as string[]).includes(word)) state.size = word as Size
    const framework = FRAMEWORKS.find((name) => name.toLowerCase() === word)
    if (framework) state.framework = framework
  }

  return state
}

export const formatHash = (id: string, state: Required<HashState>) =>
  `#${id}:${[state.view, state.framework.toLowerCase(), state.size, state.theme].join(',')}`

/** A stable id for a demo element, from its path: `/Extensions/Comments` → `demo-extensions-comments`. */
export const demoId = (pathOrSrc: string) =>
  `demo-${
    pathOrSrc
      .split('?')[0]
      .replace(/^https?:\/\/[^/]+/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'external'
  }`

/* The height a demo reported last, so the next visit starts at it instead of growing into it */

const HEIGHT_KEY = 'tiptap-docs:demo-height:'

const noSubscribe = () => () => {}

export const readStoredHeight = (id: string): number | null => {
  try {
    const value = Number(window.localStorage.getItem(HEIGHT_KEY + id))
    return value > 0 ? value : null
  } catch {
    return null
  }
}

export const storeHeight = (id: string, height: number) => {
  try {
    window.localStorage.setItem(HEIGHT_KEY + id, String(height))
  } catch {
    // Private mode: the next visit grows into it again
  }
}

/** Read once per render; null on the server, so the first client render matches it. */
export const useStoredHeight = (id: string) =>
  useSyncExternalStore(
    noSubscribe,
    () => readStoredHeight(id),
    () => null,
  )
