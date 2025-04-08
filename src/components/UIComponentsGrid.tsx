import React from 'react'
import { Card } from './ui/Card'
import { Tag } from './ui/Tag'
import { UIComponentMetaWithUrl } from '@/types'
import Link from '@/components/Link'
import { getIcon } from '@/utils/iconKit'

interface UIComponentsGridProps {
  components: UIComponentMetaWithUrl[]
  nodeComponents: UIComponentMetaWithUrl[]
  primitives: UIComponentMetaWithUrl[]
  hideAll?: boolean
  hideFree?: boolean
}

function UIComponentCard({ comp }: { comp: UIComponentMetaWithUrl }) {
  const Icon = getIcon(comp.icon)
  return (
    <Card isClickable asChild>
      <Link href={comp.url} key={comp.path}>
        <div className="flex items-center justify-between gap-2 mb-5">
          {!!Icon ? <Icon className="w-3.5 h-3.5" /> : null}
          <div className="ml-auto flex items-center gap-1">
            {comp.isNew ? <Tag variant="info">New</Tag> : null}
          </div>
        </div>
        <div className="font-semibold text-black leading-[140%]">{comp.name}</div>
        <div className="mt-2 leading-[140%] text-grayAlpha-600">{comp.description}</div>
        <div className="mt-5 flex items-center flex-wrap gap-1">
          {comp.isCloud ? <Tag>Cloud</Tag> : null}
          {comp.isOpen ? <Tag>Open Source</Tag> : null}
        </div>
      </Link>
    </Card>
  )
}

function UIComponentGroup({
  comps,
  title,
  filterFree,
}: {
  comps: UIComponentMetaWithUrl[]
  title: string
  filterFree: (list: UIComponentMetaWithUrl[]) => UIComponentMetaWithUrl[]
}) {
  const filtered = filterFree(comps)
  if (filtered.length === 0) return null

  return (
    <div>
      <div className="text-xl font-bold mb-6 leading-[120%]">{title}</div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 xl:gap-5">
        {filtered.map((comp) => (
          <UIComponentCard comp={comp} key={comp.path} />
        ))}
      </div>
    </div>
  )
}

export function UIComponentsGrid({
  components,
  nodeComponents,
  primitives,
  hideAll,
  hideFree,
}: UIComponentsGridProps) {
  if (hideAll) return null

  // Helper function to filter out free components if hideFree is set
  const filterFree = (list: UIComponentMetaWithUrl[]) =>
    hideFree ? list.filter((item) => !item.isFree) : list

  return (
    <div className="grid gap-20 first:mt-0 last:mb-0">
      <UIComponentGroup comps={components} title="Components" filterFree={filterFree} />
      <UIComponentGroup comps={nodeComponents} title="Node Components" filterFree={filterFree} />
      <UIComponentGroup comps={primitives} title="Primitives" filterFree={filterFree} />
    </div>
  )
}
