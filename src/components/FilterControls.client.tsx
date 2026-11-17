'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useUrlParam } from '@/hooks/useUrlParam'
import { cn } from '@/utils'

// Filters that keep their state in the URL, shared by the feature catalog and the changelog

/** A filter with several values, kept in the URL as a comma-separated list (`?plan=Start,Team`). */
// eslint-disable-next-line no-unused-vars
export function useListParam(key: string): [string[], (values: string[]) => void] {
  const [raw, setRaw] = useUrlParam(key, '')
  const values = useMemo(() => (raw ? raw.split(',').filter(Boolean) : []), [raw])
  return [values, (next) => setRaw(next.join(','))]
}

export function MultiSelect({
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
