/** The latest feature catalog, as `migration-scripts/feature-catalog.ts` writes it. */
export type FeatureCatalogData = {
  /** Plan filters in source order: `value` for the URL and the cards, `label` for the button. */
  plans: { value: string; label: string }[];
  /** Groups in page order. */
  groups: { id: string; title: string }[];
  /** Entries in page order, grouped by `group`. */
  entries: {
    name: string;
    description: string;
    /** lucide-react or brand icon name. */
    icon: string;
    group: string;
    /** `value` of one of `plans`. */
    plan: string;
    /** Card labels: the plan label, then the status if there is one. */
    tags: string[];
    url: string;
  }[];
};
