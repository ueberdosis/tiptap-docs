'use client';

import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { SearchIcon, XIcon } from 'lucide-react';
import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/cn';

/** Records whether the item with `id` is visible. `visible: null` removes it. */
type Report = (id: string, visible: boolean | null) => void;

type FilterState = {
  /** The selected filter value, or null for all. */
  selected: string | null;
  /** Lower-case search text, empty for none. */
  query: string;
  report: Report;
};

const FilterContext = createContext<FilterState>({ selected: null, query: '', report: () => {} });

/** Report of the nearest `CardFilterGroup`. */
const GroupContext = createContext<Report>(() => {});

/**
 * Item visibility by id, and a `report` that updates it. `anyVisible` is true while no item has
 * reported yet.
 */
function useVisibility() {
  const [items, setItems] = useState<ReadonlyMap<string, boolean>>(new Map());
  const report = useCallback<Report>((id, visible) => {
    setItems((current) => {
      if (current.get(id) === visible || (visible === null && !current.has(id))) return current;
      const next = new Map(current);
      if (visible === null) next.delete(id);
      else next.set(id, visible);
      return next;
    });
  }, []);
  const anyVisible = items.size === 0 || [...items.values()].some(Boolean);
  return { report, anyVisible };
}

/** Sets or removes `key` in the URL query, without a new history entry or scrolling. */
function writeParam(key: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set(key, value);
  else url.searchParams.delete(key);
  window.history.replaceState(window.history.state, '', url);
}

/** A filter button. A string is its own label and value. */
export type CardFilterOption = string | { value: string; label: string };

export type CardFilterProps = {
  /** Filters, one button each, after "All". Empty for no buttons, not even "All". */
  filters: CardFilterOption[];
  /** URL query key of the selected filter. Use a different key for each filter on a page. */
  param?: string;
  /** Shows a search field before the buttons. */
  search?: boolean;
  /** Text shown when no item is visible. */
  empty?: string;
  children?: ReactNode;
};

/**
 * Row of filter buttons above `children`. Shows only the `CardFilterItem`s that match the selected
 * filter and the search text. Keeps both in the URL query.
 */
export function CardFilterRoot({
  filters,
  param = 'filter',
  search = false,
  empty,
  children,
}: CardFilterProps) {
  const searchParam = param === 'filter' ? 'search' : `${param}-search`;
  const options = useMemo(
    () =>
      filters.map((filter) =>
        typeof filter === 'string'
          ? {
              value: filter,
              label: filter,
              urlValue: filter.toLowerCase().replace(/\s+/g, ''),
            }
          : { ...filter, urlValue: filter.value },
      ),
    [filters],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState('');
  const { report, anyVisible } = useVisibility();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const urlValue = query.get(param);
    setSelected(options.find((option) => option.urlValue === urlValue)?.value ?? null);
    if (search) setText(query.get(searchParam) ?? '');
  }, [options, param, search, searchParam]);

  const select = (value: string | null) => {
    setSelected(value);
    writeParam(param, options.find((option) => option.value === value)?.urlValue ?? null);
  };

  const changeText = (value: string) => {
    setText(value);
    writeParam(searchParam, value);
  };

  const buttons: { label: string; value: string | null }[] = [
    { label: 'All', value: null },
    ...options,
  ];
  const state = useMemo(
    () => ({ selected, query: search ? text.trim().toLowerCase() : '', report }),
    [selected, search, text, report],
  );

  return (
    <FilterContext value={state}>
      <div className="not-prose my-6 flex flex-wrap items-center gap-2">
        {search && (
          <div className="flex h-9 w-full items-center gap-2 rounded-lg border bg-fd-secondary/50 ps-2.5 pe-1 text-sm text-fd-muted-foreground transition-colors focus-within:ring-2 focus-within:ring-fd-ring sm:w-64">
            <SearchIcon className="size-4 shrink-0" aria-hidden />
            <input
              type="search"
              value={text}
              onChange={(event) => changeText(event.target.value)}
              placeholder="Filter…"
              aria-label="Filter"
              className="min-w-0 flex-1 bg-transparent text-fd-foreground outline-none placeholder:text-fd-muted-foreground [&::-webkit-search-cancel-button]:hidden"
            />
            {text && (
              <button
                type="button"
                aria-label="Clear"
                onClick={() => changeText('')}
                className={buttonVariants({ variant: 'ghost', size: 'icon-xs' })}
              >
                <XIcon />
              </button>
            )}
          </div>
        )}
        {options.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {buttons.map(({ label, value }) => (
              <button
                key={label}
                type="button"
                aria-pressed={selected === value}
                onClick={() => select(value)}
                className={cn(
                  buttonVariants({
                    variant: selected === value ? 'secondary' : 'ghost',
                    size: 'sm',
                  }),
                  selected !== value && 'text-fd-muted-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        {empty && !anyVisible && <p className="w-full text-sm text-fd-muted-foreground">{empty}</p>}
      </div>
      {children}
    </FilterContext>
  );
}

export type CardFilterItemProps = {
  /** One filter value or several. */
  filter: string | string[];
  children?: ReactNode;
};

/** Shows `children` when they match the selected filter and contain the search text. */
export function CardFilterItem({ filter, children }: CardFilterItemProps) {
  const { selected, query, report } = use(FilterContext);
  const reportGroup = use(GroupContext);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    setText(ref.current?.textContent?.toLowerCase() ?? '');
  }, []);

  const filters = Array.isArray(filter) ? filter : [filter];
  const visible =
    (selected === null || filters.includes(selected)) && (query === '' || text.includes(query));

  useEffect(() => {
    report(id, visible);
    reportGroup(id, visible);
  }, [id, visible, report, reportGroup]);

  useEffect(
    () => () => {
      report(id, null);
      reportGroup(id, null);
    },
    [id, report, reportGroup],
  );

  return (
    <div ref={ref} className={visible ? 'contents' : 'hidden'}>
      {children}
    </div>
  );
}

/** Wraps part of the content, for example a heading and its cards. Hides when no item in it is visible. */
export function CardFilterGroup({ children }: { children?: ReactNode }) {
  const { report, anyVisible } = useVisibility();
  return (
    <GroupContext value={report}>
      <div className={anyVisible ? 'contents' : 'hidden'}>{children}</div>
    </GroupContext>
  );
}
