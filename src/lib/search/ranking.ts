import type { AdvancedOptions } from 'fumadocs-core/search/server';
import type { Navigation } from '@/lib/navigation';
import latest from '@/lib/navigation/latest.json';
import v2 from '@/lib/navigation/v2.json';
import { docsRoute, docsV2Route } from '@/lib/shared';
import type { VersionName } from '@/lib/versions';
import { getSearchAreas, normalizeSearchText } from './areas';

/**
 * Score multipliers per record type. An exact match is a record with the same words as the whole
 * query, in any order and without punctuation.
 */
export const rankingWeights = {
  title: 3,
  heading: 1.5,
  exactTitle: 4,
  exactHeading: 2,
} as const;

/** Matching records shown per page in the search dialog. */
export const matchesPerPage = 2;

const areas: Record<VersionName, ReturnType<typeof getSearchAreas>> = {
  latest: getSearchAreas(latest as Navigation, docsRoute),
  v2: getSearchAreas(v2 as Navigation, docsV2Route),
};

/** The words of `value`, lowercase, sorted, without punctuation. */
function wordSet(value: string): string {
  return normalizeSearchText(value.replace(/[^\p{L}\p{N}]+/gu, ' '))
    .split(' ')
    .sort()
    .join(' ');
}

/** A search record as the sorter gets it: `[internal id, score, document]`. */
type Hit = [number, number, { type: string; content: string; page_id: string; url: string }];

/**
 * Orders the records of one search. If the whole query is an area name of `version`, the area's
 * overview comes first, then its other pages, then the rest. Within that, the weighted score
 * decides, and page, URL and internal id break ties.
 */
export function createHitComparator(query: string, version: VersionName | undefined) {
  const area = version ? areas[version].get(normalizeSearchText(query)) : undefined;
  const queryWords = wordSet(query);
  const ranks = new Map<number, { tier: number; score: number }>();
  const rank = ([id, score, record]: Hit) => {
    let value = ranks.get(id);
    if (value) return value;
    const exact = queryWords !== '' && wordSet(record.content) === queryWords;
    const weight =
      record.type === 'page'
        ? rankingWeights.title * (exact ? rankingWeights.exactTitle : 1)
        : record.type === 'heading'
          ? rankingWeights.heading * (exact ? rankingWeights.exactHeading : 1)
          : 1;
    const tier = !area
      ? 0
      : record.page_id === area.overview
        ? 2
        : area.pages.has(record.page_id)
          ? 1
          : 0;
    value = { tier, score: score * weight };
    ranks.set(id, value);
    return value;
  };
  return (a: Hit, b: Hit) => {
    const left = rank(a);
    const right = rank(b);
    return (
      right.tier - left.tier ||
      right.score - left.score ||
      a[2].page_id.localeCompare(b[2].page_id) ||
      a[2].url.localeCompare(b[2].url) ||
      a[0] - b[0]
    );
  };
}

function versionOf(where: unknown): VersionName | undefined {
  const tags = (where as { tags?: { containsAll?: unknown } } | undefined)?.tags?.containsAll;
  if (!Array.isArray(tags)) return undefined;
  return tags.includes('v2') ? 'v2' : tags.includes('latest') ? 'latest' : undefined;
}

type Plugin = NonNullable<AdvancedOptions['plugins']>[number];

/**
 * Sets the sorter of each search to `createHitComparator` with that search's query and version
 * tag. The sorter lives on the search's own parameters, so searches never share state.
 */
export const rankingPlugin: Plugin = {
  name: 'tiptap-docs-ranking',
  beforeSearch(_db, params) {
    if (typeof params.term !== 'string') return;
    const sortBy = createHitComparator(params.term, versionOf(params.where));
    Object.assign(params, { sortBy });
  },
};
