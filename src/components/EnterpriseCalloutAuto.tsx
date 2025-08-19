'use client'

import { usePathname } from 'next/navigation'
import { EnterpriseCallout } from './EnterpriseCallout'

type CalloutConfig = {
  variant: 'migration' | 'ai-agent' | 'pages' | 'semantic-search'
  paths: string[]
}

// Define which pages should show which callout variant
const CALLOUT_CONFIGS: CalloutConfig[] = [
  {
    variant: 'migration',
    paths: [
      '/guides/migrate-from-quill',
      '/guides/migrate-from-draftjs',
      '/guides/migrate-from-ckeditor5',
      '/guides/migrate-from-ckeditor4',
      '/guides/migrate-from-lexical',
      '/guides/migrate-from-editorjs',
      '/guides/upgrade-tiptap-v2',
    ],
  },
  {
    variant: 'ai-agent',
    paths: [
      '/editor/extensions/functionality/ai-agent',
      '/content-ai/tools-for-ai-agents',
      '/content-ai/capabilities/agent',
    ],
  },
  {
    variant: 'pages',
    paths: ['/pages'],
  },
  {
    variant: 'semantic-search',
    paths: ['/collaboration/documents/semantic-search'],
  },
]

export type EnterpriseCalloutAutoProps = {
  inline?: boolean
}

export const EnterpriseCalloutAuto = ({ inline = false }: EnterpriseCalloutAutoProps) => {
  const pathname = usePathname()
  
  // Find the matching config for the current path
  const config = CALLOUT_CONFIGS.find(({ paths }) =>
    paths.some((path) => pathname.startsWith(path))
  )
  
  if (!config) {
    return null
  }
  
  // Render based on explicit inline prop
  if (inline) {
    return <EnterpriseCallout variant={config.variant} inline className="mt-12" />
  }
  
  // Otherwise render for sidebar
  return (
    <div className="mt-8">
      <EnterpriseCallout variant={config.variant} />
    </div>
  )
}