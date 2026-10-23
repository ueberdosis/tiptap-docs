'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react'
import { createElement, useMemo } from 'react'
import { Card } from './ui/Card'
import { Tag } from './ui/Tag'
import Link from '@/components/Link'
import { CATALOG_GROUPS, CATALOG_PLANS } from '@/content/catalog'
import { INDUSTRIES } from '@/content/industries'
import { useUrlParam } from '@/hooks/useUrlParam'
import type { CatalogEntry } from '@/server/getCatalog'
import { cn } from '@/utils'
import { getIcon } from '@/utils/iconKit'

const TYPES = [
  { id: 'node', label: 'Nodes' },
  { id: 'mark', label: 'Marks' },
  { id: 'extension', label: 'Extensions' },
]

/** A filter with several values, kept in the URL as a comma-separated list (`?plan=Start,Team`). */
// eslint-disable-next-line no-unused-vars
function useListParam(key: string): [string[], (values: string[]) => void] {
  const [raw, setRaw] = useUrlParam(key, '')
  const values = useMemo(() => (raw ? raw.split(',').filter(Boolean) : []), [raw])
  return [values, (next) => setRaw(next.join(','))]
}

function MultiSelect({
  label,
  options,
  values,
  onChange,
}: {
  label: string
  options: { id: string; label: string }[]
  values: string[]
  onChange: (values: string[]) => void // eslint-disable-line no-unused-vars
}) {
  const selected = options.filter((option) => values.includes(option.id))
  const summary =
    selected.length === 0
      ? null
      : selected.length === 1
        ? selected[0].label
        : `${selected.length} selected`

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className={cn(
          'inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm whitespace-nowrap transition-colors',
          selected.length
            ? 'border-purple-500 bg-purple-50 text-purple-700'
            : 'border-neutral-300 bg-white text-black hover:border-neutral-500',
        )}
        aria-label={summary ? `${label}: ${summary}` : label}
      >
        <span className={selected.length ? 'font-semibold' : undefined}>{label}</span>
        {summary ? <span className="max-w-[9rem] truncate">{summary}</span> : null}
        <ChevronDownIcon className="size-3.5 text-grayAlpha-500" aria-hidden="true" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[12rem] max-h-[min(24rem,var(--radix-dropdown-menu-content-available-height))] overflow-auto p-1 text-sm text-black bg-white border rounded-lg shadow-md border-grayAlpha-100"
        >
          {options.map((option) => {
            const isChecked = values.includes(option.id)
            return (
              <DropdownMenu.CheckboxItem
                key={option.id}
                checked={isChecked}
                // Stay open to pick several values
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={(checked) =>
                  onChange(
                    checked
                      ? [...values, option.id]
                      : values.filter((value) => value !== option.id),
                  )
                }
                className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer outline-none data-[highlighted]:bg-grayAlpha-100"
              >
                <span
                  className={cn(
                    'grid place-items-center size-4 rounded border',
                    isChecked ? 'bg-black border-black text-white' : 'border-neutral-400',
                  )}
                  aria-hidden="true"
                >
                  {isChecked ? <CheckIcon className="size-3" /> : null}
                </span>
                {option.label}
              </DropdownMenu.CheckboxItem>
            )
          })}
          {values.length ? (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-grayAlpha-100" />
              <DropdownMenu.Item
                onSelect={() => onChange([])}
                className="px-2 py-1.5 rounded-md cursor-pointer outline-none text-grayAlpha-600 data-[highlighted]:bg-grayAlpha-100"
              >
                Clear {label.toLowerCase()}
              </DropdownMenu.Item>
            </>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function CatalogCard({ entry }: { entry: CatalogEntry }) {
  // Icons come by name from the frontmatter
  const icon = createElement(getIcon(entry.icon), { className: 'w-3.5 h-3.5', 'aria-hidden': true })
  const content = (
    <>
      <div className="flex items-center justify-between gap-2 mb-5">
        {icon}
        <div className="ml-auto flex items-center gap-1">
          {entry.status ? <Tag variant="info">{entry.status}</Tag> : null}
        </div>
      </div>
      <div className="font-semibold text-black leading-[140%]">{entry.name}</div>
      <div className="mt-2 text-sm leading-[140%] text-grayAlpha-600">{entry.description}</div>
      {entry.plan ? (
        <div className="mt-5 flex items-center flex-wrap gap-1">
          <Tag>{entry.plan}</Tag>
        </div>
      ) : null}
    </>
  )

  // A feature without docs yet has no page to link to
  if (!entry.url)
    return <Card className="border border-dashed border-grayAlpha-300 shadow-none">{content}</Card>

  return (
    <Card isClickable asChild>
      <Link href={entry.url}>{content}</Link>
    </Card>
  )
}

/** Every feature, filterable by plan, type, industry and text, grouped like the sidebar. */
export const FeatureCatalogGrid = ({ entries }: { entries: CatalogEntry[] }) => {
  const [query, setQuery] = useUrlParam('search', '')
  const [plans, setPlans] = useListParam('plan')
  const [types, setTypes] = useListParam('type')
  const [industries, setIndustries] = useListParam('industry')
  const isFiltered = !!query || plans.length + types.length + industries.length > 0

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return entries.filter(
      (entry) =>
        (plans.length === 0 || (!!entry.plan && plans.includes(entry.plan))) &&
        (types.length === 0 || types.includes(entry.type)) &&
        (industries.length === 0 ||
          (entry.industries ?? []).some((industry) => industries.includes(industry))) &&
        (!needle ||
          entry.name.toLowerCase().includes(needle) ||
          entry.description.toLowerCase().includes(needle)),
    )
  }, [entries, query, plans, types, industries])

  // One list of groups, in the order the sidebar shows them
  const groups = CATALOG_GROUPS.map((group) => ({
    group,
    items: visible.filter((entry) => entry.group === group.id),
  })).filter(({ items }) => items.length > 0)

  const reset = () => {
    setQuery('')
    setPlans([])
    setTypes([])
    setIndustries([])
  }

  return (
    <div className="grid gap-8">
      {/* Stays in view while scrolling, so the filters can change at any point */}
      <div
        role="search"
        aria-label="Filter features"
        className="sticky top-[var(--catalog-sticky-top)] z-20 -mx-3 px-3 py-2 sm:py-3 [--catalog-sticky-top:7.125rem] lg:[--catalog-sticky-top:4.25rem] bg-warmGray/95 backdrop-blur border-b border-grayAlpha-100"
      >
        <div className="flex flex-wrap items-center gap-2">
          <label className="order-1 flex-1 min-w-[10rem] sm:flex-none sm:order-none flex items-center h-9 px-2.5 gap-2 bg-white sm:w-64 rounded-lg border border-neutral-300 focus-within:border-neutral-700">
            <SearchIcon className="w-4 h-4 text-neutral-500" aria-hidden="true" />
            <input
              type="text"
              className="w-full outline-none text-sm"
              placeholder="Search features..."
              aria-label="Search features"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button
                type="button"
                className="p-0.5 rounded hover:bg-neutral-100"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <XIcon className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </label>
          <div className="order-3 sm:order-none flex flex-wrap gap-2">
            <MultiSelect
              label="Plan"
              options={CATALOG_PLANS.map((id) => ({ id, label: id }))}
              values={plans}
              onChange={setPlans}
            />
            <MultiSelect label="Type" options={TYPES} values={types} onChange={setTypes} />
            <MultiSelect
              label="Industry"
              options={INDUSTRIES.map(({ id, title }) => ({ id, label: title }))}
              values={industries}
              onChange={setIndustries}
            />
          </div>
          <div className="order-2 sm:order-none flex items-center gap-2 ml-auto text-sm text-grayAlpha-600">
            <span aria-live="polite" className="sr-only sm:not-sr-only">
              {visible.length} {visible.length === 1 ? 'feature' : 'features'}
            </span>
            {isFiltered ? (
              <button
                type="button"
                onClick={reset}
                className="px-2 py-1 rounded-md text-black hover:bg-grayAlpha-100"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-neutral-700">
          No features match{' '}
          {query ? <span className="font-semibold">&quot;{query}&quot;</span> : 'your filters'}.
        </div>
      ) : null}

      {groups.map(({ group, items }) => (
        <section key={group.id} aria-label={group.title}>
          <h2
            id={group.id}
            className="text-[1.5rem] font-bold leading-[120%] mb-6 scroll-mt-[calc(var(--catalog-sticky-top,4.25rem)+5rem)]"
          >
            {group.title}
          </h2>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 xl:gap-5">
            {items.map((entry) => (
              <CatalogCard entry={entry} key={entry.url || entry.name} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
