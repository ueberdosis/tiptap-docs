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

export type EditorPlan = {
  /** The smallest plan that covers every selected feature. */
  plan: 'Open source' | 'Start' | 'Team'
  addOns: string[]
  pilot: string[]
  services: ServiceNeed[]
  packages: string[]
  hasProPackages: boolean
  features: PlannedFeature[]
  template?: EditorPreset['template']
}

const PLAN_ORDER = ['Open source', 'Start', 'Team'] as const

export const SERVICE_TEXT: Record<ServiceNeed, { title: string; text: string; url: string }> = {
  'document-server': {
    title: 'Document Server',
    text: 'Comments and snapshots are stored on the Document Server, in Tiptap Cloud or on-premises.',
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
): EditorPlan {
  let plan: EditorPlan['plan'] = 'Open source'
  for (const feature of features) {
    const rank = PLAN_ORDER.indexOf(feature.plan as (typeof PLAN_ORDER)[number])
    if (rank > PLAN_ORDER.indexOf(plan)) plan = PLAN_ORDER[rank]
  }

  const packages = [
    ...new Set(features.flatMap((feature) => feature.package?.split(/\s+/).filter(Boolean) ?? [])),
  ].sort(
    (a, b) =>
      Number(a.startsWith('@tiptap-pro/')) - Number(b.startsWith('@tiptap-pro/')) ||
      a.localeCompare(b),
  )

  const services = [
    ...new Set(features.map((feature) => SERVICE_NEEDS[feature.name]).filter(Boolean)),
  ]

  return {
    plan,
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

/** The plan as Markdown, for agents and for "Copy for your agent". */
export function planToMarkdown(
  result: EditorPlan,
  docsRoot: string,
  title = 'Editor plan',
): string {
  const absolute = (url: string) => (url.startsWith('http') ? url : `${docsRoot}${url}`)
  const lines = [`# ${title}`, '', '## Plan', '', `- Plan: ${result.plan}`]
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

  lines.push('', '## Features', '')
  for (const feature of result.features) {
    const plan = feature.plan && feature.plan !== 'Open source' ? ` [${feature.plan}]` : ''
    lines.push(`- ${feature.name}${plan}: ${absolute(feature.url)}.md`)
  }
  return `${lines.join('\n')}\n`
}
