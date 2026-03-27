'use client'

import {
  SandpackCodeEditor,
  SandpackPreview,
  type SandpackProps,
  SandpackProvider,
} from '@codesandbox/sandpack-react'
import {
  defaultFiles,
  dependencies,
  proDependencies,
  sandpackTheme,
} from '@/utils/sandpackConfiguration'

export type CodeExampleProps = {
  withPro?: boolean
} & SandpackProps

const getDependencies = (withPro?: boolean) => {
  return withPro
    ? {
        ...dependencies,
        ...proDependencies,
      }
    : dependencies
}

export const CodeExample = ({ files, withPro = false, ...rest }: CodeExampleProps) => {
  return (
    <SandpackProvider
      {...rest}
      teamId={withPro ? 'cafabf2d-0171-4701-b874-0a4e74c07e9d' : undefined}
      files={{ ...files, ...defaultFiles }}
      theme={sandpackTheme}
      options={{
        autorun: true,
      }}
      customSetup={{ dependencies: getDependencies(withPro) }}
      template="react"
    >
      <div className="border border-grayAlpha-300 rounded-lg overflow-hidden shadow-cardLight">
        <SandpackPreview />
        <SandpackCodeEditor showLineNumbers showInlineErrors />
      </div>
    </SandpackProvider>
  )
}
