import * as Icons from 'lucide-react'
import { createElement } from 'react'

export const iconKit: Record<string, any> = Icons

export const getIcon = (name?: string | null) => {
  if (!name || !iconKit[name]) {
    return Icons.Quote
  }

  return iconKit[name]
}

/** Renders the icon called `name`, or the Quote icon when there is none. */
export const IconByName = ({
  name,
  ...props
}: { name?: string | null } & Omit<Icons.LucideProps, 'name'>) =>
  createElement(getIcon(name), props)
