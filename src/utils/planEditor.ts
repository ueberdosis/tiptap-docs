import type { CatalogPlan } from '@/content/catalog'
import { EditorPreset, SERVICE_NEEDS, ServiceNeed } from '@/content/presets'

// Turns a set of features into what it takes to build them: the plan, the
// add-ons, the services, the install command, and the pages to read. Shared by
// the configurator page and the MCP tool plan_editor, so both say the same.

export type PlannedFeature = {
  name: string
  url: string
  plan?: CatalogPlan
  package?: string
}

export type Deployment = 'cloud' | 'on-premises'

export type EditorPlan = {
  /** The smallest plan that covers every selected feature. */
  plan: 'Open source' | 'Start' | 'Team'
  deployment: Deployment
  addOns: string[]
  pilot: string[]
  services: ServiceNeed[]
  packages: string[]
  hasProPackages: boolean
  features: PlannedFeature[]
  template?: EditorPreset['template']
}

const PLAN_ORDER = ['Open source', 'Start', 'Team'] as const

/** What an editor needs to connect to the Document Server: the Collaboration extension and its provider. */
const DOCUMENT_SERVER_PACKAGES = [
  '@tiptap/extension-collaboration',
  '@tiptap/y-tiptap',
  'yjs',
  'y-protocols',
  '@tiptap-pro/provider',
]

export const SERVICE_TEXT: Record<ServiceNeed, { title: string; text: string; url: string }> = {
  'document-server': {
    title: 'Document Server',
    text: 'Comments and snapshots are stored on the Document Server, in Tiptap Cloud or on-premises. The editor connects to it with the Collaboration extension and the TiptapCollabProvider.',
    url: '/hosting',
  },
  'sync-server': {
    title: 'Sync server',
    text: 'Real-time editing needs a server: the open source Hocuspocus, or the Document Server in Tiptap Cloud or on-premises.',
    url: '/hosting',
  },
  'tiptap-service': {
    title: 'Tiptap services',
    text: 'AI and conversion features call Tiptap services, in Tiptap Cloud or on-premises.',
    url: '/hosting',
  },
}

export function planEditor(
  features: PlannedFeature[],
  template?: EditorPreset['template'],
  deployment: Deployment = 'cloud',
): EditorPlan {
  let plan: EditorPlan['plan'] = 'Open source'
  for (const feature of features) {
    const rank = PLAN_ORDER.indexOf(feature.plan as (typeof PLAN_ORDER)[number])
    if (rank > PLAN_ORDER.indexOf(plan)) plan = PLAN_ORDER[rank]
  }

  const services = [
    ...new Set(features.map((feature) => SERVICE_NEEDS[feature.name]).filter(Boolean)),
  ]

  const packages = [
    ...new Set([
      ...features.flatMap((feature) => feature.package?.split(/\s+/).filter(Boolean) ?? []),
      ...(services.includes('document-server') ? DOCUMENT_SERVER_PACKAGES : []),
    ]),
  ].sort(
    (a, b) =>
      Number(a.startsWith('@tiptap-pro/')) - Number(b.startsWith('@tiptap-pro/')) ||
      a.localeCompare(b),
  )

  return {
    plan,
    deployment,
    addOns: features.filter((feature) => feature.plan === 'Add-on').map((feature) => feature.name),
    pilot: features
      .filter((feature) => feature.plan === 'Pilot program')
      .map((feature) => feature.name),
    services,
    packages,
    hasProPackages: packages.some((name) => name.startsWith('@tiptap-pro/')),
    features,
    template,
  }
}

/** The plan to name: on-premises always needs Enterprise. */
export function planName(result: EditorPlan): string {
  return result.deployment === 'on-premises' ? 'Enterprise' : result.plan
}

export type NextStep = { label: string; url: string; text: string }

/** What to do next: build for free, start a trial, or talk to sales. */
export function nextSteps(result: EditorPlan): { primary: NextStep; secondary?: NextStep } {
  const trial = {
    label: 'Start free trial',
    url: 'https://cloud.tiptap.dev/register',
    text: 'Try the plan for 30 days, without a credit card.',
  }
  const sales = {
    label: 'Talk to sales',
    url: 'https://tiptap.dev/contact-sales',
    text: 'Add-ons, the pilot program, and on-premises are set up with the Tiptap team.',
  }
  if (result.deployment === 'on-premises' || result.addOns.length || result.pilot.length) {
    return { primary: sales, secondary: trial }
  }
  if (result.plan === 'Open source') {
    return {
      primary: {
        label: 'Start building',
        url: '/editor/getting-started/install',
        text: 'Everything you picked is open source.',
      },
    }
  }
  return {
    primary: trial,
    secondary: { label: 'See pricing', url: 'https://tiptap.dev/pricing', text: '' },
  }
}

/** The plan as Markdown, for agents and for "Copy for your agent". */
export function planToMarkdown(
  result: EditorPlan,
  docsRoot: string,
  title = 'Editor plan',
): string {
  const absolute = (url: string) => (url.startsWith('http') ? url : `${docsRoot}${url}`)
  const lines = [`# ${title}`, '', '## Plan', '', `- Plan: ${planName(result)}`]
  lines.push(
    `- Runs on: ${result.deployment === 'on-premises' ? 'your own servers (on-premises, Enterprise)' : 'Tiptap Cloud'}`,
  )
  if (result.addOns.length) lines.push(`- Add-ons: ${result.addOns.join(', ')}`)
  if (result.pilot.length) lines.push(`- Pilot program: ${result.pilot.join(', ')}`)

  if (result.services.length) {
    lines.push('', '## Services', '')
    for (const service of result.services) {
      lines.push(`- ${SERVICE_TEXT[service].text} ${absolute(SERVICE_TEXT[service].url)}.md`)
    }
  }

  lines.push('', '## Install', '', '```bash', `npm install ${result.packages.join(' ')}`, '```', '')
  lines.push(
    `Add your framework's package too, such as \`@tiptap/react\`: ${absolute('/editor/getting-started/install')}.md`,
  )
  if (result.hasProPackages) {
    lines.push(
      `Packages under \`@tiptap-pro\` come from Tiptap's private registry: ${absolute('/guides/pro-extensions')}.md`,
    )
  }

  if (result.template) {
    lines.push(
      '',
      '## UI template',
      '',
      `- ${result.template.title}: ${absolute(result.template.url)}.md`,
    )
  }

  const { primary } = nextSteps(result)
  lines.push(
    '',
    '## Next step',
    '',
    `- ${primary.label}: ${absolute(primary.url)}. ${primary.text}`.trim(),
  )

  lines.push('', '## Features', '')
  for (const feature of result.features) {
    const plan = feature.plan && feature.plan !== 'Open source' ? ` [${feature.plan}]` : ''
    lines.push(`- ${feature.name}${plan}: ${absolute(feature.url)}.md`)
  }
  return `${lines.join('\n')}\n`
}
