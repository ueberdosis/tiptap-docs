import { SidebarConfig, SidebarGroup, SidebarLink } from '@/types'

export type Breadcrumb = {
  href?: string
  text: string
}

export const generateBreadcrumbs = (config: SidebarConfig, pathname: string): Breadcrumb[] => {
  const isRoot = pathname === config.rootHref

  if (isRoot) {
    return [
      {
        text: config.title,
        href: config.rootHref,
      },
    ] as Breadcrumb[]
  }

  let breadcrumbs: Breadcrumb[] = [
    {
      text: config.title,
      href: config.rootHref,
    },
  ]

  const pathParts = pathname.split('/').filter(Boolean)
  let currentUrl = ''

  const findItemByPathname = (
    checkedPathname: string,
    items: SidebarConfig['items'],
  ): SidebarLink | SidebarGroup | null => {
    let currentItem: SidebarLink | SidebarGroup | null = null

    for (const item of items) {
      if ((item as { isActive: boolean }).isActive === false) {
        continue
      }

      if (item.href === checkedPathname && item.href !== pathname) {
        if (item.type === 'group') {
          currentItem = { ...item, href: item.children?.[0].href }
        } else {
          currentItem = item
        }
      }

      if (!currentItem && item.children) {
        currentItem = findItemByPathname(checkedPathname, item.children as SidebarConfig['items'])
      }
    }

    return currentItem
  }

  for (const part of pathParts) {
    currentUrl = `${currentUrl}/${part}`
    const linkForPart = findItemByPathname(currentUrl, config.items)

    if (linkForPart) {
      breadcrumbs.push({
        href: linkForPart.href,
        text: linkForPart.title,
      })
    }
  }

  return breadcrumbs
}
