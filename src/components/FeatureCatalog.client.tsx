'use client'

import { SearchIcon, XIcon } from 'lucide-react'
import { createElement, useMemo } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Tag } from './ui/Tag'
import Link from '@/components/Link'
import {
  CATALOG_AREAS,
  CATALOG_GROUPS,
  CATALOG_PLANS,
  CatalogArea,
  CatalogPlan,
} from '@/content/catalog'
import { useUrlParam } from '@/hooks/useUrlParam'
import type { CatalogEntry } from '@/server/getCatalog'
import { getIcon } from '@/utils/iconKit'

const ALL = 'all'
const TYPES = [
  { id: 'node', label: 'Nodes' },
  { id: 'mark', label: 'Marks' },
  { id: 'extension', label: 'Extensions' },
]

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: T; label: string }[]
  value: string
  onChange: (value: T | typeof ALL) => void // eslint-disable-line no-unused-vars
}) {
  return (
    <div className="flex flex-wrap items-center gap-1" role="group" aria-label={label}>
      <span className="text-sm text-grayAlpha-600 mr-1 w-12">{label}</span>
      <Button variant="tertiary" isActive={value === ALL} onClick={() => onChange(ALL)}>
        All
      </Button>
      {options.map((option) => (
        <Button
          key={option.id}
          variant="tertiary"
          isActive={value === option.id}
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

function CatalogCard({ entry }: { entry: CatalogEntry }) {
  // Icons come by name from the frontmatter
  const icon = createElement(getIcon(entry.icon), { className: 'w-3.5 h-3.5', 'aria-hidden': true })
  return (
    <Card isClickable asChild>
      <Link href={entry.url}>
        <div className="flex items-center justify-between gap-2 mb-5">
          {icon}
          <div className="ml-auto flex items-center gap-1">
            {entry.status ? <Tag variant="info">{entry.status}</Tag> : null}
          </div>
        </div>
        <div className="font-semibold text-black leading-[140%]">{entry.name}</div>
        <div className="mt-2 leading-[140%] text-grayAlpha-600">{entry.description}</div>
        <div className="mt-5 flex items-center flex-wrap gap-1">
          <Tag>{entry.plan}</Tag>
        </div>
      </Link>
    </Card>
  )
}

/** Every feature, filterable by area, plan, type and text, grouped like the sidebar. */
export const FeatureCatalogGrid = ({ entries }: { entries: CatalogEntry[] }) => {
  const [query, setQuery] = useUrlParam('search', '')
  const [area, setArea] = useUrlParam<CatalogArea | typeof ALL>('area', ALL)
  const [plan, setPlan] = useUrlParam<CatalogPlan | typeof ALL>('plan', ALL)
  const [type, setType] = useUrlParam<string>('type', ALL)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return entries.filter(
      (entry) =>
        (area === ALL || entry.area === area) &&
        (plan === ALL || entry.plan === plan) &&
        (type === ALL || entry.type === type) &&
        (!needle ||
          entry.name.toLowerCase().includes(needle) ||
          entry.description.toLowerCase().includes(needle)),
    )
  }, [entries, query, area, plan, type])

  const sections = (Object.keys(CATALOG_AREAS) as CatalogArea[])
    .map((areaId) => ({
      areaId,
      groups: CATALOG_GROUPS.filter((group) => group.area === areaId)
        .map((group) => ({ group, items: visible.filter((entry) => entry.group === group.id) }))
        .filter(({ items }) => items.length > 0),
    }))
    .filter(({ groups }) => groups.length > 0)

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <label className="flex items-center p-2 gap-2 bg-white max-w-[36rem] rounded-lg border border-neutral-300 focus-within:border-neutral-700">
          <SearchIcon className="w-4 h-4 text-neutral-500" aria-hidden="true" />
          <input
            type="text"
            className="w-full outline-none"
            placeholder="Filter features..."
            aria-label="Filter features"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button
              type="button"
              className="p-1 hover:bg-neutral-100"
              onClick={() => setQuery('')}
              aria-label="Clear filter"
            >
              <XIcon className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : null}
        </label>
        <FilterRow
          label="Area"
          options={(Object.keys(CATALOG_AREAS) as CatalogArea[]).map((id) => ({
            id,
            label: CATALOG_AREAS[id],
          }))}
          value={area}
          onChange={setArea}
        />
        <FilterRow
          label="Plan"
          options={CATALOG_PLANS.map((id) => ({ id, label: id }))}
          value={plan}
          onChange={setPlan}
        />
        <FilterRow label="Type" options={TYPES} value={type} onChange={setType} />
      </div>

      {sections.length === 0 ? (
        <div className="text-neutral-700">
          No features match{' '}
          {query ? <span className="font-semibold">&quot;{query}&quot;</span> : 'your filters'}.
        </div>
      ) : null}

      {sections.map(({ areaId, groups }) => (
        <section key={areaId} className="grid gap-12" aria-label={CATALOG_AREAS[areaId]}>
          <h2 className="text-2xl font-bold leading-[120%]">{CATALOG_AREAS[areaId]}</h2>
          {groups.map(({ group, items }) => (
            <div key={group.id}>
              <h3 className="text-xl font-bold mb-6 leading-[120%]">{group.title}</h3>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 xl:gap-5">
                {items.map((entry) => (
                  <CatalogCard entry={entry} key={entry.url} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
