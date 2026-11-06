// What a page needs, and how far along it is, named the same way in the sidebar
// and the page header. A page's plan and status come from its frontmatter tags.

/** Plans in the order readers compare them. */
export const PLANS = [
  'Open source',
  'Start',
  'Team',
  'Business',
  'Add-on',
  'Pilot program',
] as const

export type Plan = (typeof PLANS)[number]

/** How the page header names each plan, and what its tooltip says. */
export const PLAN_LABELS: Record<Plan, { label: string; tooltip: string }> = {
  'Open source': { label: 'Open source', tooltip: 'MIT licensed, free to use.' },
  Start: { label: 'Start plan', tooltip: 'Included in Start, Team, Business, and Enterprise.' },
  Team: { label: 'Team plan', tooltip: 'Included in Team, Business, and Enterprise.' },
  Business: { label: 'Business plan', tooltip: 'Included in Business and Enterprise.' },
  'Add-on': { label: 'Paid add-on', tooltip: 'Added to a paid plan.' },
  'Pilot program': {
    label: 'Pilot program',
    tooltip: 'Contact our team to join the pilot program.',
  },
}

/** Statuses a feature passes on to its pages. */
export const STATUSES = ['Deprecated', 'Alpha', 'Beta'] as const

export type Status = (typeof STATUSES)[number]

/** The plan that frontmatter tag types name, if any. */
export function planFromTags(types: string[]): Plan | undefined {
  if (types.includes('restricted')) return 'Pilot program'
  if (types.includes('addon')) return 'Add-on'
  if (types.includes('business')) return 'Business'
  if (types.includes('team')) return 'Team'
  if (types.some((type) => ['start', 'beginStart', 'starter'].includes(type))) return 'Start'
  if (types.includes('mit') || types.includes('pro')) return 'Open source'
  return undefined
}

/** The plan a sidebar tag names, such as `Add-on`, or `Starter` for Start. */
export function planFromLabel(tag: string): Plan | undefined {
  if (tag.toLowerCase() === 'starter') return 'Start'
  return PLANS.find((plan) => plan.toLowerCase() === tag.toLowerCase())
}

/** The status a sidebar tag names, such as `beta` or `Deprecated`. */
export function statusFromLabel(tag: string): Status | undefined {
  return STATUSES.find((status) => status.toLowerCase() === tag.toLowerCase())
}
