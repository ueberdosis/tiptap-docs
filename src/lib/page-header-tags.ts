import inheritedLabels from '@/lib/inherited-labels.json';
import type { PageTag } from '@/lib/page-schema';
import { inheritedPlanTags, inheritedStatusTags } from '@/lib/page-tag-labels';

const planTypes = [
  'restricted',
  'addon',
  'business',
  'team',
  'start',
  'beginStart',
  'paid',
  'mit',
  'pro',
];
const statusTypes = ['deprecated', 'alpha', 'beta', 'experiment', 'new'];
const newForDays = 90;

type Inherited = {
  plan?: keyof typeof inheritedPlanTags;
  status?: keyof typeof inheritedStatusTags;
};

/** Plan first, then status, then version, then the rest. */
const tagRank = (tag: PageTag) =>
  planTypes.includes(tag.type)
    ? 0
    : statusTypes.includes(tag.type)
      ? 1 + statusTypes.indexOf(tag.type) / 10
      : tag.type === 'version'
        ? 2
        : 3;

/** Whether a page that went live on `since` (YYYY-MM-DD) still counts as new. */
const isNew = (since: unknown) => {
  if (typeof since !== 'string') return false;
  const start = Date.parse(since);
  return !Number.isNaN(start) && Date.now() - start < newForDays * 24 * 60 * 60 * 1000;
};

/**
 * The tags a page header shows, in order. Latest: the frontmatter tags plus the plan and status
 * the page inherits from the sidebar (`inherited-labels.json`) when it has none of its own, without
 * `new` tags older than 90 days, sorted by plan, status, version, then the rest. v2: the frontmatter
 * tags as they are. `slugs` is the page path inside its version.
 */
export function pageHeaderTags(
  tags: PageTag[] = [],
  slugs: string[],
  version: 'latest' | 'v2',
): PageTag[] {
  if (version === 'v2') return tags;
  const inherited: Inherited =
    (inheritedLabels as Record<string, Inherited>)[`/${slugs.join('/')}`] ?? {};
  const own = (types: string[]) => tags.some((tag) => types.includes(tag.type));
  const added: PageTag[] = [];
  if (inherited.plan && !own(planTypes)) added.push({ type: inheritedPlanTags[inherited.plan] });
  // `new` says when a page went live, not how stable it is
  const ownStatus = own(statusTypes.filter((type) => type !== 'new'));
  if (inherited.status && !ownStatus) added.push({ type: inheritedStatusTags[inherited.status] });
  return [...tags, ...added]
    .map((tag, index) => ({ tag, index }))
    .filter(({ tag }) => tag.type !== 'new' || isNew(tag.since))
    .sort((a, b) => tagRank(a.tag) - tagRank(b.tag) || a.index - b.index)
    .map(({ tag }) => tag);
}
