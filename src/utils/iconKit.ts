import * as Icons from 'lucide-react'

export const iconKit: Record<string, any> = Icons

export const getIcon = (name?: string | null) => {
  if (!name || !iconKit[name]) {
    return Icons.Quote
  }

  return iconKit[name]
}
