// How readers get each add-on and pilot feature, as its docs page says. The
// platform page, plan_editor, and the configurator read from here, so they
// give the same answer. Every catalog feature with the Add-on plan needs an entry.

export type AddOnAccess = {
  /** Can be tried during the 30-day trial; leave it out when the docs don't say. */
  trial?: boolean
  /** Can be bought in the dashboard without talking to the team. */
  dashboard: boolean
  /** Where to ask for it otherwise. */
  contact?: string
}

export const ADD_ON_ACCESS: Record<string, AddOnAccess> = {
  'Tracked Changes': { trial: true, dashboard: true },
  Compare: { dashboard: false, contact: 'https://tiptap.dev/contact-sales' },
  'AI Toolkit': {
    dashboard: false,
    contact: 'https://tiptap.dev/contact-sales?form=server-ai-toolkit',
  },
  'AI Toolkit client': {
    dashboard: false,
    contact: 'https://tiptap.dev/contact-sales?form=ai-toolkit',
  },
}

/** Pilot program features are open to teams who join it. */
export const PILOT_PROGRAM_FORM = 'https://tiptap.dev/contact-sales?form=pilot-program'

export const DASHBOARD_URL = 'https://cloud.tiptap.dev/v2/billing'
