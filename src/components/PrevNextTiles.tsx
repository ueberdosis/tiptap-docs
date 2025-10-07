import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Link from '@/components/Link'
import type { SidebarConfig, SidebarGroup, SidebarLink } from '@/types'

type Props = {
  config?: SidebarConfig
  currentPath: string
}

function normalize(href: string) {
  if (!href) return '/'
  // keep absolute URLs untouched
  if (href.startsWith('http://') || href.startsWith('https://')) return href

  // remove trailing slash and ensure leading slash
  const trimmed = href.replace(/\/$/, '')
  if (trimmed === '') return '/'
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

type SidebarItem = SidebarLink | SidebarGroup | Omit<SidebarLink, 'type'>

function isGroup(item: SidebarItem): item is SidebarGroup {
  return (item as SidebarGroup).type === 'group'
}

function flatten(items: SidebarItem[]): SidebarLink[] {
  const out: SidebarLink[] = []

  for (const item of items) {
    if (isGroup(item)) {
      const group = item as SidebarGroup
      if (group.children) {
        out.push(...flatten(group.children as SidebarItem[]))
      }
    } else {
      // children from sidebar sometimes omit the `type` field, ensure shape
      const linkLike = item as SidebarLink | Omit<SidebarLink, 'type'>
      let normalizedLink: SidebarLink

      if ('type' in linkLike) {
        normalizedLink = linkLike as SidebarLink
      } else {
        normalizedLink = { ...(linkLike as Omit<SidebarLink, 'type'>), type: 'link' } as SidebarLink
      }

      if (normalizedLink.href) out.push(normalizedLink)
      if (normalizedLink.children) {
        out.push(...flatten(normalizedLink.children as SidebarItem[]))
      }
    }
  }

  return out
}

function Card({ href, title, isNext }: { href: string; title: string; isNext?: boolean }) {
  return (
    <Link
      href={href}
      className="bg-white group flex gap-6 p-6 items-center border rounded-lg shadow-sm hover:shadow-md transition"
    >
      {!isNext ? <ArrowLeftIcon className="size-5 flex-none" /> : null}
      <span className="flex flex-col gap-2 flex-1">
        <span className="text-sm text-grayAlpha-500">{isNext ? 'Next up' : 'Previously'}</span>
        <span className="text-lg font-semibold">{title}</span>
      </span>
      {isNext ? <ArrowRightIcon className="size-5 flex-none" /> : null}
    </Link>
  )
}

export default function PrevNextTiles({ config, currentPath }: Props) {
  if (!config) return null

  const normalizedCurrent = normalize(currentPath)
  const links = flatten(config.items).filter((l) => !!l.href && !l.external)
  const normalizedLinks = links.map((l) => ({ ...l, _norm: normalize(l.href) }))

  const idx = normalizedLinks.findIndex((l) => l._norm === normalizedCurrent)

  if (idx === -1) return null

  const prev = idx > 0 ? normalizedLinks[idx - 1] : undefined
  const next = idx < normalizedLinks.length - 1 ? normalizedLinks[idx + 1] : undefined

  if (!prev && !next) return null

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {prev ? (
          <div className="sm:col-start-1">
            <Card href={prev.href} title={prev.title} />
          </div>
        ) : null}

        {next ? (
          <div className={!prev ? 'sm:col-start-2' : ''}>
            <Card isNext href={next.href} title={next.title} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
