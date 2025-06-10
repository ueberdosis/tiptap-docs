import type { MDXComponents } from 'mdx/types'
import slugify from 'slugify'
import { HashIcon } from 'lucide-react'
import React from 'react'
import { Codeblock } from './components/Codeblock'
import Link from '@/components/Link'
import { Checklist, CheckboxItem } from './components/Checklist'

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
    h1: ({ children, ...props }) => {
      const id = getHeadlineId(children)
      return (
        <h1 className="group relative" {...props} id={id}>
          <a className={hashClass} href={`#${id}`}>
            <HashIcon className="w-full h-full" />
          </a>
          {children}{' '}
        </h1>
      )
    },
    h2: ({ children, ...props }) => {
      const id = getHeadlineId(children)
      return (
        <h2 className="group relative" {...props} id={id}>
          <a className={hashClass} href={`#${id}`}>
            <HashIcon className="w-full h-full" />
          </a>
          {children}{' '}
        </h2>
      )
    },
    h3: ({ children, ...props }) => {
      const id = getHeadlineId(children)
      return (
        <h3 className="group relative" {...props} id={id}>
          <a className={hashClass} href={`#${id}`}>
            <HashIcon className="w-full h-full" />
          </a>
          {children}{' '}
        </h3>
      )
    },
    h4: ({ children, ...props }) => {
      const id = getHeadlineId(children)
      return (
        <h4 className="group relative" {...props} id={id}>
          <a className={hashClass} href={`#${id}`}>
            <HashIcon className="w-full h-full" />
          </a>
          {children}{' '}
        </h4>
      )
    },
    h5: ({ children, ...props }) => {
      const id = getHeadlineId(children)
      return (
        <h5 className="group relative" {...props} id={id}>
          <a className={hashClass} href={`#${id}`}>
            <HashIcon className="w-full h-full" />
          </a>
          {children}{' '}
        </h5>
      )
    },
    h6: ({ children, ...props }) => {
      const id = getHeadlineId(children)
      return (
        <h6 className="group relative" {...props} id={id}>
          <a className={hashClass} href={`#${id}`}>
            <HashIcon className="w-full h-full" />
          </a>
          {children}{' '}
        </h6>
      )
    },
    table: (props) => (
      <div className="w-full overflow-auto my-12 first:mt-0 last:mb-0">
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
