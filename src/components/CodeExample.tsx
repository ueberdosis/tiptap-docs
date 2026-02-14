'use client'

import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProps,
} from '@codesandbox/sandpack-react'
import {
  defaultFiles,
  sandpackTheme,
  dependencies,
  proDependencies,
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
      <div className="border border-grayAlpha-300 dark:border-white/10 rounded-lg overflow-hidden shadow-cardLight dark:shadow-none">
        <SandpackPreview />
        <SandpackCodeEditor showLineNumbers showInlineErrors />
      </div>
    </SandpackProvider>
  )
}
