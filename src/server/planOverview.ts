import { getCatalog } from './getCatalog'

// What each plan includes, from the catalog. The platform page shows it as a
// table, and its Markdown version as a list, so both stay current when a
// feature's plan changes.

export type PlanRow = {
  title: string
  text: string
  features: { name: string; url: string }[]
  /** Too many features to list: link the filtered catalog instead. */
  catalog?: { url: string; count: number }
  links?: { label: string; url: string }[]
}

const PLANS = [
  {
    plan: 'Open source',
    title: 'Open source',
    text: 'Free under the MIT license: the editor, its extensions, and the Hocuspocus server.',
  },
  { plan: 'Start', title: 'Start', text: 'The first paid plan of Tiptap Cloud.' },
  { plan: 'Team', title: 'Team', text: 'Features that need at least the Team plan.' },
  { plan: 'Add-on', title: 'Add-ons', text: 'Paid on top of a plan.' },
  {
    plan: 'Pilot program',
    title: 'Pilot program',
    text: "Early access through Tiptap's pilot program.",
  },
] as const

export function getPlanRows(): PlanRow[] {
  const documented = getCatalog().filter((entry) => entry.url)
  const rows: PlanRow[] = PLANS.map(({ plan, title, text }) => {
    const features = documented
      .filter((entry) => entry.plan === plan)
      .map(({ name, url }) => ({ name, url }))
    if (plan === 'Open source') {
      return {
        title,
        text,
        features: [],
        catalog: {
          url: `/editor/extensions/overview?plan=${encodeURIComponent(plan)}`,
          count: features.length,
        },
      }
    }
    return { title, text, features }
  })

  rows.push({
    title: 'Enterprise',
    text: 'On-premises deployment, a dedicated cloud, and dedicated support.',
    features: [],
    links: [
      { label: 'On-premises', url: '/hosting/on-premises' },
      { label: 'Dedicated cloud', url: '/hosting/cloud#dedicated-cloud' },
      { label: 'Talk to sales', url: 'https://tiptap.dev/contact-sales' },
    ],
  })
  return rows
}
