import type { MDXComponents } from 'mdx/types'
import slugify from 'slugify'
import { HashIcon } from 'lucide-react'
import React from 'react'
import { Codeblock } from './components/Codeblock'
import { Checklist, CheckboxItem } from './components/Checklist'
import Link from '@/components/Link'

/**
 * Extracts the text from a nested children object
 */
const getHeadlineId = (children: React.ReactNode) => {
  let text = ''
  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      text += child
    }
    if (typeof child === 'object' && React.isValidElement(child)) {
      text += getHeadlineId(child.props.children)
    }
  })
  return children ? `${slugify(text, { strict: true, lower: true })}` : ''
}

const hashClass =
  'text-grayAlpha-600 transition-all opacity-0 group-hover:opacity-100 absolute -left-5 pr-1 top-0 bottom-0 m-auto w-5 h-4'

const createHeading = (Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
  return function Heading({ children, ...props }: React.ComponentProps<'h1'>) {
    const id = getHeadlineId(children)
    return (
      <Tag className="group relative" {...props} id={id}>
        <a className={hashClass} href={`#${id}`}>
          <HashIcon className="w-full h-full" />
        </a>
        {children}{' '}
      </Tag>
    )
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ children }) => <>{children}</>,
    pre: (props) => (
      <Codeblock>
        <pre className="hljs">{props.children}</pre>
      </Codeblock>
    ),
    code: (props) => <code {...props} />,
    h1: createHeading('h1'),
    h2: createHeading('h2'),
    h3: createHeading('h3'),
    h4: createHeading('h4'),
    h5: createHeading('h5'),
    h6: createHeading('h6'),
    table: (props) => (
      <div className="w-full overflow-auto my-8 first:mt-0 last:mb-0">
        <table {...props} className="w-full" />
      </div>
    ),
    a: (props) => {
      const isExternal = props.href?.startsWith('http')

      // @ts-ignore
      return <Link {...props} target={isExternal ? '_blank' : props.target} />
    },
    // Direct custom component usage
    Checklist,
    CheckboxItem,
  }
}
