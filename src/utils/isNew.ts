// "New" marks a page that went live recently, and goes away on its own

/** How long a page counts as new. */
export const NEW_FOR_DAYS = 90

/** Whether a page that went live on `since` (YYYY-MM-DD) is still new. */
export function isNew(since: string | undefined, now: number = Date.now()): boolean {
  if (!since) return false
  const start = Date.parse(since)
  return !Number.isNaN(start) && now - start < NEW_FOR_DAYS * 24 * 60 * 60 * 1000
}
